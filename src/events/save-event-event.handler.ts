import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { StockOptionRemovedEvent } from "../modules/stocks/commands/remove-stock-option/events/stock-option-removed.event";
import { StockOptionAddedEvent } from "../modules/stocks/commands/add-stock-option/events/stock-option-added.event";
import { EventRepository } from "../repositories/event.repository";
import { CategoryCreatedEvent } from "../modules/categories/commands/create-category/events/category-created.event";
import { CategoryUpdatedEvent } from "../modules/categories/commands/update-category/events/category-updated.event";
import { CategoryDeletedEvent } from "../modules/categories/commands/delete-category/events/category-deleted.event";
import { ProductImageAddedEvent } from "../modules/product-images/commands/add-product-image/events/product-image-added.event";
import { ProductCreatedEvent } from "../modules/products/commands/create-product/events/product-created.event";
import { ProductDeletedEvent } from "../modules/products/commands/delete-product/events/product-deleted.event";
import { ProductUpdatedEvent } from "../modules/products/commands/update-product/events/product-updated.event";
import { StockCreatedEvent } from "../modules/stocks/commands/create-stock/events/stock-created.event";
import { ProductStockUpdatedEvent, StockOptionUpdatedEvent } from 'shop-shared-server/dist/src/index';
import { StockRemovedEvent } from "../modules/stocks/commands/remove-stock-by-product/events/stock-removed.event";
import { ProductImageDeletedEvent } from "../modules/product-images/commands/delete-product-image/events/product-image-deleted.event";
import { ProductFileDeletedEvent } from "../modules/storage/commands/delete-product-file/events/product-file-deleted.event";
import { ProductFolderDeletedEvent } from "../modules/storage/commands/delete-product-folder/events/product-folder-deleted.event";
import { BannerDetailCreatedEvent } from "../modules/banners/commands/create-banner-detail/events/banner-detail-created.event";
import { BannerDetailUpdatedEvent } from "../modules/banners/commands/update-banner-detail/events/banner-detail-updated.event";
import { BannerDetailDeletedEvent } from "../modules/banners/commands/delete-banner-detail/events/banner-detail-deleted.event";

@EventsHandler(
    BannerDetailCreatedEvent,
    BannerDetailDeletedEvent,
    BannerDetailUpdatedEvent,
    CategoryCreatedEvent,
    CategoryUpdatedEvent,
    CategoryDeletedEvent,
    ProductCreatedEvent,
    ProductDeletedEvent,
    ProductImageAddedEvent,
    ProductImageDeletedEvent,
    ProductFileDeletedEvent,
    ProductFolderDeletedEvent,
    ProductStockUpdatedEvent,
    ProductUpdatedEvent,
    StockCreatedEvent,
    StockOptionAddedEvent,
    StockOptionRemovedEvent,
    StockOptionUpdatedEvent,
    StockRemovedEvent
)
export class SaveEventHandler implements IEventHandler<any> {

    constructor(
        private eventRepository: EventRepository
    ){}

    handle(event: any) {
        this.eventRepository.addEvent(event);
    }

}