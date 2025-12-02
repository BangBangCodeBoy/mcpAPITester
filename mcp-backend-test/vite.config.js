import { defineConfig } from "vite";

export default defineConfig({
    server: {
        port: 5500,
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
                secure: false,
                // 쿠키 전송을 위해 필요
                configure: (proxy, _options) => {
                    proxy.on("proxyReq", (proxyReq, req, _res) => {
                        // 쿠키가 있으면 전달
                        if (req.headers.cookie) {
                            proxyReq.setHeader("Cookie", req.headers.cookie);
                        }
                    });
                },
            },
        },
    },
});
