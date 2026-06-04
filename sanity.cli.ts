import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "881hwmwa",
    dataset: "production",
  },
  deployment: {
    appId: "jqex286kt2zxxcm3t9dqz5u2",
    /**
     * Bật tính năng tự cập nhật Sanity Studio khi có phiên bản mới
     */
    autoUpdates: true,
  },
});
