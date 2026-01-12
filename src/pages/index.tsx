import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Header } from '@/components/features/home/Header';
import { Hero } from '@/components/features/home/Hero';
import { Stats } from '@/components/features/home/Stats';
import { PathSelector } from '@/components/features/home/PathSelector';
import { HowItWorks } from '@/components/features/home/HowItWorks';
import { Themes } from '@/components/features/home/Themes';
import { Resources } from '@/components/features/home/Resources';
import { Footer } from '@/components/features/home/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Stats />
        <PathSelector />
        <HowItWorks />
        <Themes />
        <Resources />
      </main>
      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'fr', ['common', 'home'])),
    },
  };
};
