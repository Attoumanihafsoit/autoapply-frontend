import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="lang-toggle">
      <button
        onClick={() => setLanguage('fr')}
        className={language === 'fr' ? 'lang-active' : 'lang-inactive'}
      >
        FR
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={language === 'en' ? 'lang-active' : 'lang-inactive'}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
