# Marketolog Academy — Multi-Course Executive Learning Platform

Практическая образовательная платформа нового поколения для подготовки маркетологов, специалистов по закупке трафика, руководителей партнерских сетей и B2B Outbound специалистов (Middle, Senior, Lead, Executive).

## 4 Полноценных Направления Обучения

1. **Senior Marketing & Head of Growth** (6 модулей, 34 урока)
   - Юнит-экономика ($LTV:CAC$, Payback, Magic Number, MER, Cohort Retention).
   - Эконометрическое моделирование (Attribution, MMM, iROAS, Incrementality testing).
   - Growth Loops, Viral & Content Loops, Product-Led Growth (PLG).
   - B2B Enterprise Growth, Account-Based Marketing (ABM) и пайплайны.
   - Ценообразование, Packaging, монетизация и защита стратегии перед CFO / Board.
   - Инженерная подготовка к собеседованиям и формулировки резюме по стандарту Google XYZ.

2. **Media Buying & PPC Specialist** (5 модулей, 15 уроков)
   - Юнит-экономика аукционов (CPM, eCPM, Ad Rank, Quality Score, Bidding Strategies).
   - Meta Ads (CAPI, Adv+, структуры кампаний, креативные фабрики).
   - Google Ads & Performance Max (Search, Target ROAS/CPA, Feed Hygiene).
   - TikTok Ads & Видео-креативы (Hooks, Spark Ads, UGC-пайплайны).
   - Инфраструктура медиабаинга: антидетект-браузеры, прокси, платежные бины, клоакинг и WhiteHat/GreyHat комплаенс.

3. **Affiliate Manager & Head of Affiliates** (5 модулей, 15 уроков)
   - Архитектура партнерского маркетинга (CPA, CPL, RevShare, Hybrid).
   - Трекинг и постбеки (S2S Postback, Keitaro, Voluum, AppsFlyer, диплинки).
   - Рекрутинг и хантинг топовых команд через спай-сервисы, конференции и эксклюзивные капы.
   - Антифрод, комплаенс, когортный анализ качества и юридическая процедура срезов (Scrubbing).
   - Финансовый менеджмент, юнит-экономика и P&L аффилиат-отдела.

4. **Sales Development Representative / Lead Gen Specialist** (5 модулей, 15 уроков)
   - Фундамент B2B Outbound (ICP, Buyer Personas, TAM/SAM/SOM, Intent Data).
   - Стек скрапинга и водопадного обогащения (LinkedIn Sales Navigator, Clay, Apollo, ZeroBounce).
   - Инфраструктура Cold Email & Deliverability (домены-сателлиты, SPF, DKIM, DMARC, пулы прогрева Smartlead/Instantly).
   - Копирайтинг холодных цепочек (PAS, No-Commitment CTA, 10-touch мультиканальные последовательности).
   - Холодные звонки, преодоление Gatekeeper, квалификация лидов по BANT vs MEDDPIC vs CHAMP и SDR-to-AE Handover.

---

## Интерактивные Тренажеры и Симуляторы (100% Client-Side)

- **Unit Economics Simulator**: Расчет когортной окупаемости, стресс-тесты оттока и маржинальности.
- **A/B Test Significance Calculator**: Z-test, доверительные интервалы, MDE и проверка статистической значимости.
- **Media Buying Simulator**: Моделирование CPM, CTR, CR1, CR2, допустимого CPA и точки Break-Even ROAS.
- **Affiliate P&L Simulator**: Моделирование комиссионных моделей, учет фрода, чарджбеков и чистой маржи рекламодателя.
- **Outbound B2B Pipeline Engine**: Моделирование числа доменов, Deliverability, Open/Reply Rate, Show-up Rate и пайплайна ARR.
- **Google XYZ Resume Builder**: Интерактивный генератор измеримых сеньорных достижений.
- **Senior Interview Simulator**: 79+ стресс-кейсов с разбором скрытых намерений интервьюера, антипаттернов и эталонных ответов.
- **Offline / PWA Ready**: Полностью статическое приложение, работающее без интернета и внешних бэкенд-запросов.

---

## Архитектура и Стек

- **Framework**: Next.js 15 (App Router, SSG static HTML export)
- **UI Library**: React 19, Tailwind CSS, Lucide React
- **Architecture**: Feature-Sliced Design (FSD: `app` -> `widgets` -> `features` -> `entities` -> `shared`)
- **Data Integrity**: Zod schemas для строгой runtime и SSG валидации
- **TypeScript**: Strict mode, Zero `any` policy

---

## Запуск проекта локально

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Проверка строгой типизации (0 ошибок)
npm run type-check

# Сборка production SSG билда (168 статических страниц)
npm run build

# Локальный просмотр production-сборки
npm run start
```

