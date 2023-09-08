import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Stream } from 'stream';
import { FileUpload } from '../../common/interfaces/file-upload.interface';
import { PaginatedInput } from '../../common/dto/filter-input';
import { PaginatedList } from '../../common/dto/paginated-list';
import { responseMessages } from '../../common/messages/response.messages';
import { Asset } from './entities/asset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ID } from '../../@types';

@Injectable()
export class AssetService implements OnApplicationBootstrap {
  private logger = new Logger('AssetService');

  constructor(
    @InjectRepository(Asset)
    private readonly repository: Repository<Asset>,
  ) {}

  onApplicationBootstrap() {
    this.checkSourcePath();
  }

  async create(file: FileUpload): Promise<Asset> {
    const uniqueFilename = this.getUniqueFilename(file.filename);
    const filepath = AssetService.getFilepath(uniqueFilename);
    const source = filepath.split(AssetService.assetsPath)[0];

    try {
      await this.saveFile(file.createReadStream, filepath);
      const data = {
        filename: uniqueFilename,
        mimeType: file.mimetype,
        source,
      };

      const asset = new Asset();
      this.repository.merge(asset, data);

      return this.repository.create(asset);
    } catch (error) {
      await this.deleteFile(filepath);
      throw error;
    }
  }

  async findAll(filters?: PaginatedInput): Promise<PaginatedList<Asset>> {
    const totalItems = await this.repository.count();
    const items = await this.repository.find(filters);

    return new PaginatedList(items, totalItems);
  }

  async findOne(id: ID): Promise<Asset | null> {
    return this.repository.findOneBy({ id });
  }

  private saveFile(createReadStream: () => Stream, filepath: fs.PathLike): Promise<void> {
    return new Promise((resolve, reject) => {
      const write = fs.createWriteStream(filepath);
      createReadStream()
        .pipe(write)
        .on('finish', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  private deleteFile(filepath: fs.PathLike): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filepath)) return reject(responseMessages.notFound(responseMessages.file.entity));
      if (!fs.statSync(filepath).isFile()) return reject(responseMessages.file.notFile);

      fs.rm(filepath, (error) => {
        if (error) return reject(error);
        else return resolve();
      });
    });
  }

  getUniqueFilename(filename: string): string {
    const { name: filenameWithoutExtension, ext: extension } = path.parse(filename);

    let normalizedFilename: string;
    let ordering = 0;
    do {
      const toNormalize = ordering > 0 ? `${filenameWithoutExtension}__${ordering}${extension}` : filename;
      normalizedFilename = this.normalizeString(toNormalize, '-');
      ordering++;
    } while (!fs.existsSync(AssetService.getFilepath(normalizedFilename)));

    return normalizedFilename;
  }

  private checkSourcePath() {
    if (!fs.existsSync(AssetService.sourcePath)) {
      fs.mkdir(AssetService.sourcePath, (err) => {
        this.logger.error(err);
      });
    }
  }

  static get staticPath() {
    return path.join(process.cwd(), 'static');
  }

  static get assetsPath() {
    return path.join(this.staticPath, 'assets');
  }

  static get sourcePath() {
    return path.join(this.assetsPath, 'source');
  }

  static get previewPath() {
    return path.join(this.assetsPath, 'preview');
  }

  static getFilepath(filename: string) {
    return path.join(this.sourcePath, filename);
  }

  /**
   * Credits to:
   * Normalizes a string to replace non-alphanumeric and diacritical marks with
   * plain equivalents.
   * Based on https://stackoverflow.com/a/37511463/772859
   */
  normalizeString(input: string, spaceReplacer = ' ') {
    return (input || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[!"£$%^&*()+[\]{};:@#~?\\/,|><`¬'=‘’]/g, '')
      .replace(/\s+/g, spaceReplacer);
  }
}
