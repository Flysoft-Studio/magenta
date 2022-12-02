#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();
            if cfg!(target_os = "windows") {
                window_shadows::set_shadow(&main_window, true).expect("Unsupported platform!");
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Error while running tauri application.");
}
