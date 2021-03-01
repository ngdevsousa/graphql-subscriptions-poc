import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./health.controller";
import { AppService } from "./health.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it('should return ""', () => {
      expect(appController.health()).toBe("");
    });
  });
});
