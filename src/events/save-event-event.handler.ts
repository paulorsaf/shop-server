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
import { StockRemovedEvent } from "../modules/stocks/commands/remove-stock-by-product/events/stock-removed.event";
import { ProductImageDeletedEvent } from "../modules/product-images/commands/delete-product-image/events/product-image-deleted.event";
import { ProductFileDeletedEvent } from "../modules/storage/commands/delete-product-file/events/product-file-deleted.event";
import { ProductFolderDeletedEvent } from "../modules/storage/commands/delete-product-folder/events/product-folder-deleted.event";
import { BannerDetailCreatedEvent } from "../modules/banners/commands/create-banner-detail/events/banner-detail-created.event";
import { BannerDetailUpdatedEvent } from "../modules/banners/commands/update-banner-detail/events/banner-detail-updated.event";
import { BannerDetailDeletedEvent } from "../modules/banners/commands/delete-banner-detail/events/banner-detail-deleted.event";
import { ProductStockUpdatedEvent } from "../modules/stocks/commands/update-product-stock/events/product-stock-updated.event";
import { StockOptionUpdatedEvent } from "../modules/stocks/commands/update-stock-option/events/stock-option-updated.event";
import { PurchaseStatusUpdatedEvent } from "../modules/purchases/events/purchase-status-updated.event";
import { PurchaseStatusChangeEmailSentEvent } from "../modules/email/events/purchase-status-change-email-sent.event";
import { SendPurchaseStatusChangeEmailFailedEvent } from "../modules/email/events/send-purchase-status-change-email-failed.event";
import { CompanyAddressUpdatedEvent } from "../modules/companies/events/company-address-updated.event";
import { CompanyUpdatedEvent } from "../modules/companies/events/company-updated.event";
import { CompanyLogoUpdatedEvent } from "../modules/companies/events/company-logo-updated.event";
import { CompanyAboutUsUpdatedEvent } from "../modules/companies/events/company-about-us-updated.event";
import { CompanyPaymentUpdatedEvent } from "../modules/companies/events/company-payment-updated.event";
import { CupomCreatedEvent } from "../modules/cupoms/events/cupom-created.event";
import { CompanyTotalStockUpdatedEvent } from "../modules/stocks/events/company-total-stock-updated.event";
import { PurchaseSentToSystemEvent } from "../modules/purchases/events/purchase-sent-to-system.event";
import { PurchaseProductQuantityEditedEvent } from "../modules/purchases/events/purchase-product-quantity-edited.event";
import { CompanyCityDeliveryPriceUpdatedEvent } from "../modules/companies/events/company-city-delivery-price-updated.event";
import { PurchaseProductCancelledEvent } from "../modules/purchases/events/purchase-product-cancelled.event";
import { CompanyServiceTaxUpdatedEvent } from "../modules/companies/events/company-service-tax-updated.event";
import { ProductVisibilityChangedEvent } from "../modules/products/commands/change-product-visibility/events/change-product-visibility.event";
import { CategoryVisibilityUpdatedEvent } from "../modules/categories/commands/update-category-visibility/events/category-visibility-updated.event";
import { ProductsFromFileUploadUpdatedEvent } from "../modules/products/commands/update-products-from-file-upload/events/products-from-file-upload-updated.event";

@EventsHandler(
    BannerDetailCreatedEvent,
    BannerDetailDeletedEvent,
    BannerDetailUpdatedEvent,
    CategoryCreatedEvent,
    CategoryUpdatedEvent,
    CategoryDeletedEvent,
    CategoryVisibilityUpdatedEvent,

    CompanyUpdatedEvent,
    CompanyAboutUsUpdatedEvent,
    CompanyAddressUpdatedEvent,
    CompanyLogoUpdatedEvent,
    CompanyPaymentUpdatedEvent,
    CompanyServiceTaxUpdatedEvent,

    CupomCreatedEvent,

    ProductCreatedEvent,
    ProductDeletedEvent,
    ProductImageAddedEvent,
    ProductImageDeletedEvent,
    ProductFileDeletedEvent,
    ProductFolderDeletedEvent,
    ProductStockUpdatedEvent,
    ProductUpdatedEvent,
    ProductVisibilityChangedEvent,
    ProductsFromFileUploadUpdatedEvent,

    PurchaseStatusUpdatedEvent,
    PurchaseProductQuantityEditedEvent,
    StockOptionAddedEvent,
    StockOptionRemovedEvent,
    StockOptionUpdatedEvent,
    StockRemovedEvent,
    CompanyTotalStockUpdatedEvent,
    CompanyCityDeliveryPriceUpdatedEvent,

    PurchaseStatusChangeEmailSentEvent,
    SendPurchaseStatusChangeEmailFailedEvent,
    PurchaseSentToSystemEvent,
    PurchaseProductCancelledEvent
)
export class SaveEventHandler implements IEventHandler<any> {

    constructor(
        private eventRepository: EventRepository
    ){}

    handle(event: any) {
        this.eventRepository.addEvent(event);
    }

}