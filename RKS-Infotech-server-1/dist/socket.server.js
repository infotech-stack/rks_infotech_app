"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const message_module_1 = require("./modules/task-management/message/message.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(message_module_1.MessageModule);
    app.enableCors();
    await app.listen(4000);
}
bootstrap();
//# sourceMappingURL=socket.server.js.map