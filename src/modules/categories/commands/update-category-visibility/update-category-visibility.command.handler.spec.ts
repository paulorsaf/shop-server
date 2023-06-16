import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { Category } from '../../entities/category';
import { CategoryRepositoryMock } from '../../../../mocks/category-repository.mock';
import { CategoryRepository } from '../../repositories/category.repository';
import { UpdateCategoryVisibilityCommandHandler } from './update-category-visibility.command.handler';
import { UpdateCategoryVisibilityCommand } from './update-category-visibility.command';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CategoryVisibilityUpdatedEvent } from './events/category-visibility-updated.event';

describe('UpdateCategoryVisibilityCommandHandler', () => {

    let handler: UpdateCategoryVisibilityCommandHandler;
    let categoryRepository: CategoryRepositoryMock;
    let eventBus: EventBusMock;

    const companyId = "anyCompanyId";
    const userId = "anyUserId";
    const categoryId = "anyCategoryId";

    const command = new UpdateCategoryVisibilityCommand(
        userId, companyId, categoryId
    );

    beforeEach(async () => {
        eventBus = new EventBusMock();
        categoryRepository = new CategoryRepositoryMock();

        const module: TestingModule = await Test.createTestingModule({
        controllers: [
            UpdateCategoryVisibilityCommandHandler
        ],
        imports: [
            CqrsModule
        ],
        providers: [
            CategoryRepository
        ]
        })
        .overrideProvider(CategoryRepository).useValue(categoryRepository)
        .overrideProvider(EventBus).useValue(eventBus)
        .compile();

        handler = module.get<UpdateCategoryVisibilityCommandHandler>(UpdateCategoryVisibilityCommandHandler);
    });

    it('given category not found, then return not found exception', async () => {
        categoryRepository.response = null;

        await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
    });

    describe('given category belongs to company', () => {

        const category = {
            id: categoryId, companyId, isVisible: true
        } as Category;

        it('when category belongs to company, then update category', async () => {
            categoryRepository.response = category;
        
            await handler.execute(command);
        
            expect(categoryRepository.updatedWith).toEqual({
                categoryId, isVisible: false
            })
        });
    
        it('when category updated, then call category updated event', async () => {
            categoryRepository.response = category;
        
            await handler.execute(command);
        
            expect(eventBus.published).toEqual(
                new CategoryVisibilityUpdatedEvent(
                    companyId,
                    userId,
                    categoryId,
                    false
                )
            )
        });

    })

    it('given category doesnt belong to company, then return error', async () => {
        const category = {
            companyId: "anyOtherCompanyId", isVisible: true
        } as Category;
        categoryRepository.response = category;

        await expect(handler.execute(command)).rejects.toThrowError(UnauthorizedException);
    });

});
