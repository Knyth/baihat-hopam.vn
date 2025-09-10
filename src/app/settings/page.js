// src/app/settings/page.js
import Container from '@/components/layout/Container';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import SettingsClient from './SettingsClient';
import { Nunito_Sans } from 'next/font/google';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const nunito = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user;
  if (!user) redirect('/auth?callbackUrl=/settings');

  return (
    <Container>
      <div className={nunito.className}>
        <h1 className={styles.pageHeading}>Cài đặt Tài khoản</h1>
        <p className={styles.subtitle}>
          Quản lý thông tin cá nhân và cài đặt bảo mật của bạn.
        </p>
        <div className={styles.divider} />

        <SettingsClient user={{ id: user.id, name: user.name, email: user.email }} />
      </div>
    </Container>
  );
}
