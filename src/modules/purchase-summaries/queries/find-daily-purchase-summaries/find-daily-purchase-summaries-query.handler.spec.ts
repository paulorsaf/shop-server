import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseSummaryRepository } from '../../repositories/purchase-summary.repository';
import { FindDailyPurchaseSummariesQueryHandler } from './find-daily-purchase-summaries-query.handler';
import { FindDailyPurchaseSummariesQuery } from './find-daily-purchase-summaries.query';

describe('FindDailyPurchaseSummariesQueryHandler', () => {

  let handler: FindDailyPurchaseSummariesQueryHandler;
  let dailyPurchaseSummaryRepository: DailyPurchaseSummaryRepositoryMock;

  const command = new FindDailyPurchaseSummariesQuery(
    'anyCompanyId', 'anyDateFrom', 'anyDateUntil'
  );

  beforeEach(async () => {
    dailyPurchaseSummaryRepository = new DailyPurchaseSummaryRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindDailyPurchaseSummariesQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        PurchaseSummaryRepository
      ]
    })
    .overrideProvider(PurchaseSummaryRepository).useValue(dailyPurchaseSummaryRepository)
    .compile();

    handler = module.get<FindDailyPurchaseSummariesQueryHandler>(FindDailyPurchaseSummariesQueryHandler);
  });

  it('given company and dates, then return daily purchase summaries', async () => {
    const summaries = [{id: 1}];

    dailyPurchaseSummaryRepository._response = summaries;

    const response = await handler.execute(command);

    expect(response).toEqual(summaries);
  });

});

class DailyPurchaseSummaryRepositoryMock {
  _response;
  find(){
    return this._response;
  }
}