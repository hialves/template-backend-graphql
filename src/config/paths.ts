import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import { AssetService } from '../modules/asset/asset.service';

export const paths = {
  // restaurantLogos: path.resolve('public', 'images', 'restaurant-logos'),
  // static: AssetService.staticPath,
  // assets: AssetService.assetsPath,
  source: AssetService.sourcePath,
  preview: AssetService.previewPath,
};

export function generateFolders() {
  Object.entries(paths).forEach(([key, p]) => {
    if (!fs.existsSync(p)) {
      const folderUri = p.split(process.cwd())[1].replace(/[\\]/g, '/');
      Logger.log(`Generating folder for ${key} on ${folderUri}`, 'Paths');
      fs.mkdirSync(p, { recursive: true });
    }
  });
}
