import { Injectable } from '@nestjs/common';
import { catalog } from '../catalog/catalog';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const rows = await this.prisma.category.findMany({
      include: { deviceTypes: true },
    });
    const bySlug = new Map(rows.map((row) => [row.slug, row]));

    return catalog.flatMap((category) => {
      const row = bySlug.get(category.slug);
      if (!row) {
        return [];
      }
      const typesBySlug = new Map(row.deviceTypes.map((type) => [type.slug, type]));
      return [
        {
          id: row.id,
          name: row.name,
          slug: row.slug,
          deviceTypes: category.deviceTypes.flatMap((type) => {
            const saved = typesBySlug.get(type.slug);
            if (!saved) {
              return [];
            }
            return [
              {
                id: saved.id,
                name: saved.name,
                slug: saved.slug,
                specFields: type.specFields,
                conditionFields: type.conditionFields,
              },
            ];
          }),
        },
      ];
    });
  }
}
