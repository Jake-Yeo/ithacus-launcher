use std::{
    net::{SocketAddr, TcpStream},
    process::Command,
    time::Duration,
};

use tauri::{
    utils::config::WebviewUrl,
    webview::{NewWindowResponse, WebviewWindowBuilder},
    Manager,
};

const LAUNCHER_URL: &str = "http://127.0.0.1:8787/__ithacus/";

fn launcher_is_available() -> bool {
    let address = SocketAddr::from(([127, 0, 0, 1], 8787));
    TcpStream::connect_timeout(&address, Duration::from_millis(750)).is_ok()
}

fn is_internal_url(url: &tauri::Url) -> bool {
    matches!(url.scheme(), "tauri" | "about")
        || (url.scheme() == "http"
            && url.host_str() == Some("127.0.0.1")
            && url.port_or_known_default() == Some(8787))
}

fn open_external(url: &tauri::Url) {
    if matches!(url.scheme(), "http" | "https" | "mailto") {
        let _ = Command::new("/usr/bin/open").arg(url.as_str()).spawn();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.unminimize();
                let _ = window.show();
                let _ = window.set_focus();
            }
        }))
        .setup(|app| {
            let initial_url = if launcher_is_available() {
                WebviewUrl::External(LAUNCHER_URL.parse().expect("valid launcher URL"))
            } else {
                WebviewUrl::App("index.html".into())
            };

            WebviewWindowBuilder::new(app, "main", initial_url)
                .title("Isle of Ithaca")
                .inner_size(1180.0, 820.0)
                .min_inner_size(760.0, 560.0)
                .center()
                .on_navigation(|url| {
                    if is_internal_url(url) {
                        true
                    } else {
                        open_external(url);
                        false
                    }
                })
                .on_new_window(|url, _features| {
                    open_external(&url);
                    NewWindowResponse::Deny
                })
                .build()?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Isle of Ithaca");
}
