// src/app/settings/SettingsClient.js
"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styles from "./page.module.css";
import { updateProfile, changePassword } from "./actions";

function SubmitBtn({ children, className }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? "Đang xử lý…" : children}
    </button>
  );
}

export default function SettingsClient({ user }) {
  const [activeTab, setActiveTab] = useState("profile");

  const [profileState, profileAction] = useActionState(updateProfile, {
    ok: null,
    message: "",
  });
  const [pwdState, pwdAction] = useActionState(changePassword, {
    ok: null,
    message: "",
  });

  return (
    <section className={styles.wrapper}>
      {/* ===== Sidebar ===== */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Danh mục</div>
        <ul className={styles.navList}>
          <li>
            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "profile" ? styles.menuActive : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Thông tin cá nhân
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "password" ? styles.menuActive : ""}`}
              onClick={() => setActiveTab("password")}
            >
              Đổi mật khẩu
            </button>
          </li>
        </ul>
      </aside>

      {/* ===== Content (không lặp tiêu đề ở cột phải) ===== */}
      <main className={styles.content}>
        {/* ---- TAB: PROFILE ---- */}
        {activeTab === "profile" && (
          <div className={styles.card}>
            <div className={styles.cardBody}>
              {profileState.message ? (
                <div
                  className={`${styles.alert} ${profileState.ok ? styles.success : styles.error}`}
                >
                  {profileState.message}
                </div>
              ) : null}

              <form action={profileAction} className={styles.form}>
                <div className={styles.inputGrp}>
                  <label className={styles.label} htmlFor="displayName">
                    Tên hiển thị
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    className={styles.input}
                    defaultValue={user.name || ""}
                  />
                </div>

                <div className={styles.inputGrp}>
                  <label className={styles.label} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    className={styles.input}
                    defaultValue={user.email || ""}
                    disabled
                    readOnly
                  />
                  <p className={styles.helpText}>Email không thể thay đổi.</p>
                </div>

                <SubmitBtn className={styles.primaryBtn}>Lưu thay đổi</SubmitBtn>
              </form>
            </div>
          </div>
        )}

        {/* ---- TAB: PASSWORD (❌ không render tiêu đề “Đổi mật khẩu” ở cột phải) ---- */}
        {activeTab === "password" && (
          <div className={styles.card}>
            <div className={styles.cardBody}>
              {pwdState.message ? (
                <div className={`${styles.alert} ${pwdState.ok ? styles.success : styles.error}`}>
                  {pwdState.message}
                </div>
              ) : null}

              <form action={pwdAction} className={styles.form}>
                <div className={styles.inputGrp}>
                  <label className={styles.label} htmlFor="current">
                    Mật khẩu hiện tại
                  </label>
                  <input id="current" name="current" type="password" className={styles.input} />
                </div>

                <div className={styles.inputGrp}>
                  <label className={styles.label} htmlFor="next">
                    Mật khẩu mới
                  </label>
                  <input id="next" name="next" type="password" className={styles.input} />
                </div>

                <div className={styles.inputGrp}>
                  <label className={styles.label} htmlFor="confirm">
                    Xác nhận mật khẩu mới
                  </label>
                  <input id="confirm" name="confirm" type="password" className={styles.input} />
                </div>

                <SubmitBtn className={styles.primaryBtn}>Đổi mật khẩu</SubmitBtn>
              </form>
            </div>
          </div>
        )}
      </main>
    </section>
  );
}
