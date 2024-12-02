import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
  Pagination,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate';
import { SelectQueryBuilder } from 'typeorm';

/**
 * customPagination Function for oneToMany Relations due to library limitation
 */
import { ObjectLiteral } from 'typeorm';

export async function customPaginate<T extends ObjectLiteral = any, CustomMetaType = IPaginationMeta>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions<CustomMetaType>,
): Promise<Pagination<T>> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, totalItems] = await queryBuilder.getManyAndCount();

  const pagination = await paginate<T>(queryBuilder, {
    page: options.page,
    limit: options.limit,
    paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
    metaTransformer: (meta) => {
      return {
        currentPage: meta.currentPage,
        itemCount: meta.itemCount,
        itemsPerPage: meta.itemsPerPage,
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / +options.limit),
      };
    },
  });

  return {
    items: pagination.items,
    meta: pagination.meta,
  };
}
