import { Controller, Get } from "@nestjs/common";
import { AppService } from "./health.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  health(): string {
    return this.appService.health();
  }
}
