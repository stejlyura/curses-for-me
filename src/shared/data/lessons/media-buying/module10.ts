import { Lesson } from '@/entities/lesson';

export const module10Lessons: Lesson[] = [
  {
    id: '10-1-server-side-gtm-meta-capi-enhanced-conversions',
    slug: '10-1-server-side-gtm-meta-capi-enhanced-conversions',
    courseSlug: 'media-buying',
    moduleId: 10,
    moduleTitle: 'Модуль 4: Server-Side Трекинг, CAPI & Privacy',
    lessonNumber: '4.1',
    title: 'Server-Side GTM, Meta Conversions API (CAPI) и Google Enhanced Conversions',
    level: 'Senior',
    readTimeMinutes: 12,
    targetAudience: 'Senior Media Buyers, Tracking Engineers, Performance Leads',
    summary:
      'Архитектура серверного трекинга в эпоху AdBlockers и Safari ITP. Настройка Cloud GTM (Google Cloud Run / AWS), сквозная передача User Data с SHA-256 хешированием, синхронизация fbp/fbc кук и достижение Event Match Quality (EMQ) 8.5+ из 10.',
    competencies: ['Attribution & MMM', 'Data & A/B Rigor'],
    coreConcepts: [
      {
        title: 'Meta Conversions API (CAPI) & Deduplication',
        explanation:
          'Серверный протокол отправки веб-событий напрямую с бэкенда в Meta Graph API. Требует передачи одинакового event_id и event_name в браузере и на сервере для дедупликации.',
      },
      {
        title: 'Google Enhanced Conversions',
        explanation:
          'Механизм хеширования персональных данных (email, телефон в sha256) в момент отправки конверсии в Google Ads, повышающий точность атрибуции на 10-15%.',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Meta Event Match Quality (EMQ)',
        industry: 'E-commerce',
        targetBenchmark: '>= 8.0 - 9.0 / 10 на событии Purchase',
        dangerZone: '< 6.0 (потеря до 35% данных атрибуции)',
        calculation: 'Оценка совпадения параметров (email, phone, fbp, fbc, ip, user_agent)',
        seniorContext:
          'Высокий EMQ напрямую снижает стоимость конверсий в аукционе, так как алгоритм точнее сопоставляет покупателя с профилем в соцсети.',
      },
    ],
    researchInsights: [
      {
        source: 'Meta Technical Documentation & Case Studies',
        year: '2023',
        finding:
          'Внедрение Conversions API в связке с браузерным пикселем дает в среднем +13% дополнительно зарегистрированных транзакций и снижение CPA на 8%.',
        practicalTakeaway:
          'Всегда используйте гибридную модель (Browser Pixel + Server CAPI) с дедупликацией по event_id.',
      },
    ],
    interviewCases: [
      {
        question:
          'После настройки CAPI в Events Manager появилось предупреждение: «High Event Deduplication Failure Rate (45%)». Что сломалось и как это починить?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Глубокое понимание протокола дедупликации Meta: генерация уникального event_id на стороне клиента и сервера, временные окна сопоставления.',
        antiPatternAnswer: '«Отключу серверные события, оставлю только браузерные».',
        seniorBattleTestedAnswer:
          '«Предупреждение означает, что Meta получает одно и то же событие из браузера и с сервера, но не может их сопоставить, засчитывая двойные конверсии либо отбрасывая их. Причины: 1) Браузерный тег генерирует один event_id (например, через timestamp в JS), а бэкенд шлет другой или не шлет его вовсе; 2) Разница во времени отправки превышает 48 часов; 3) Несовпадение названия события (например, purchase vs Purchase). Решение: генерировать уникальный UUID заказа (например, order_id) на стороне бэкенда/CMS и пробрасывать этот же точный order_id в качестве event_id и в dataLayer для браузера, и в payload серверного CAPI запроса».',
        probingQuestions: [
          'Как fbp и fbc куки влияют на Match Quality?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Внедрил серверный трекинг [X], повысив точность атрибуции на [Y]%',
        template:
          'Развернул Server-Side GTM инфраструктуру и Meta CAPI с SHA-256 хешированием, подняв Event Match Quality до {X}/10 и восстановив {Y}% утерянных конверсий.',
        concreteExample:
          'Внедрил Server-Side GTM на Google Cloud Run и Meta Conversions API с дедупликацией, увеличив атрибуцию транзакций на 18% и подняв Event Match Quality с 5.4 до 8.8.',
        keywords: ['Server-Side GTM', 'Meta CAPI', 'Event Match Quality', 'Deduplication', 'Enhanced Conversions'],
      },
    ],
    quizQuestions: [
      {
        id: '10-1-q1',
        question: 'Какое ключевое условие необходимо соблюсти для корректной дедупликации событий между браузерным пикселем и серверным CAPI?',
        options: [
          'События должны отправляться в одну и ту же миллисекунду',
          'Оба события должны передавать идентичный event_id и одинаковое имя события (event_name)',
          'Серверный запрос должен содержать IP-адрес США',
          'Браузерный пиксель должен быть полностью отключен',
        ],
        correctOptionIndex: 1,
        explanation: 'Meta сопоставляет пару (event_name, event_id). Если они совпадают, сохраняется событие с наивысшим качеством данных, а дубль отбрасывается.',
        commonMistake: 'Передают случайные timestamp, которые различаются между фронтом и бэкендом.',
      },
    ],
    longreadMarkdown: `
### Архитектура гибридного трекинга (Browser + Server-Side)

\`\`\`
[Пользователь совершает покупку на Сайте]
        │
        ├──> (1) Браузер: JS Pixel отправляет 'Purchase' + event_id: "order_12345"
        │                                 │
        │                                 ▼
        │                    [Meta Events Manager]
        │                    (Дедупликация: 1 покупка!)
        │                                 ▲
        └──> (2) Бэкенд: Webhook -> Server-Side GTM (CAPI)
                         'Purchase' + event_id: "order_12345"
                         + email_hash (sha256) + phone_hash
\`\`\`
    `,
  },
  {
    id: '10-2-skadnetwork-4-adattributionkit-deduplication',
    slug: '10-2-skadnetwork-4-adattributionkit-deduplication',
    courseSlug: 'media-buying',
    moduleId: 10,
    moduleTitle: 'Модуль 4: Server-Side Трекинг, CAPI & Privacy',
    lessonNumber: '4.2',
    title: 'iOS 14.5+ SKAdNetwork (SKAN 4.0), AdAttributionKit и мобильная атрибуция',
    level: 'Lead',
    readTimeMinutes: 11,
    targetAudience: 'Heads of UA, Mobile Media Buyers, Growth Engineers',
    summary:
      'Атрибуция мобильного трафика в экосистеме Apple. Принципы SKAN 4.0: Fine vs Coarse conversion values, 3 окна постбеков (0-2 дня, 3-7 дней, 8-35 дней), Crowd Anonymity пороги. Переход на AdAttributionKit в iOS 17.4+.',
    competencies: ['Attribution & MMM', 'Data & A/B Rigor'],
    coreConcepts: [
      {
        title: 'SKAN 4.0 Windows & Conversion Values',
        explanation:
          '3 последовательных окна таймеров Apple. Окно 1 (Fine-grained value 0-63 + Coarse low/medium/high), Окна 2 и 3 (только Coarse value) с рандомизированной задержкой постбека 24-48 часов.',
      },
      {
        title: 'Crowd Anonymity Tiers',
        explanation:
          'Уровни анонимности (Tier 0-3), определяющие, какую степень детализации (source_identifier и conversion_value) Apple вернет в постбеке в зависимости от объема установок в кампании.',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Crowd Anonymity Threshold',
        industry: 'Mobile / Gaming',
        targetBenchmark: 'Tier 2-3 (получение Fine Value 0-63)',
        dangerZone: 'Tier 0 (все конверсии возвращаются с null value)',
        calculation: 'Требуется минимум ~10-20 установок в сутки на адсет',
        seniorContext:
          'Если спенд на кампанию слишком размазан, Apple скрывает данные конверсий (null postback), делая оптимизацию невозможной.',
      },
    ],
    researchInsights: [
      {
        source: 'AppsFlyer & Adjust SKAN 4.0 Performance Index',
        year: '2023',
        finding:
          'Кампании с правильной настройкой Coarse Values в SKAN 4.0 генерируют на 26% более высокий ROAS за счет продолжения оптимизации в окнах 3-7 и 8-35 дней.',
        practicalTakeaway:
          'Настройте Coarse Value (Low, Medium, High) так, чтобы они отражали ранний LTV (например, Low = завершил туториал, Medium = добавил карту, High = оформил подписку).',
      },
    ],
    interviewCases: [
      {
        question:
          'В отчете SKAN 4.0 для новой iOS кампании 70% постбеков приходят со значением `null conversion value`. Что это означает и как это исправить?',
        difficulty: 'Director',
        whatInterviewerLooksFor:
          'Глубокое понимание порогов Crowd Anonymity: когда объем установок ниже порога конфиденциальности Apple, система принудительно обнуляет conversion value.',
        antiPatternAnswer: '«Разработчики приложения забыли прописать SDK вызовы».',
        seniorBattleTestedAnswer:
          '«Это прямое следствие падения кампании в Crowd Anonymity Tier 0. Apple скрывает conversion value, чтобы защитить приватность отдельных пользователей при малом объеме установок. Решение: 1) Консолидировать спенд: сократить количество кампаний и адсетов до минимума (не более 1-2 кампаний на гео/приложение); 2) Увеличить дневной бюджет на адсет, чтобы гарантировать минимум 20-30 установок в сутки; 3) Как только объем превысит лимит Tier 1/2, Apple разблокирует сначала Coarse Value, а затем Fine Value (0-63)».',
        probingQuestions: [
          'Как AdAttributionKit расширяет возможности альтернативных магазинов приложений в ЕС?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Оптимизировал мобильный UA в iOS, подняв точность сигналов SKAN на [X]%',
        template:
          'Спроектировал 64-ступенчатую схему Fine & Coarse conversion values в SKAN 4.0, сократив долю null-постбеков с {X}% до {Y}% и подняв iOS ROAS на {Z}%.',
        concreteExample:
          'Реструктурировал UA-кампании под SKAN 4.0 и Crowd Anonymity Tier 2, снизив долю null-конверсий до <8% и масштабировав iOS спенд до $150k/мес с ROAS D30 1.65x.',
        keywords: ['SKAdNetwork', 'SKAN 4.0', 'Crowd Anonymity', 'Mobile UA', 'Conversion Value'],
      },
    ],
    quizQuestions: [
      {
        id: '10-2-q1',
        question: 'Какое минимальное условие необходимо для предотвращения получения null conversion value в постбеках Apple SKAN?',
        options: [
          'Покупка подписки Apple Developer Enterprise',
          'Преодоление порога Crowd Anonymity за счет достаточного суточного объема установок на кампанию',
          'Использование только формата Playable Ads',
          'Установка окна атрибуции ровно 7 дней',
        ],
        correctOptionIndex: 1,
        explanation: 'Apple возвращает null, если количество инсталлов в когорте недостаточно велико для гарантии невозможности деанонимизации конкретного юзера.',
        commonMistake: 'Считают, что null — это баг в коде мобильного SDK трекера.',
      },
    ],
    longreadMarkdown: `
### Эволюция приватности в iOS: SKAN 4.0 и AdAttributionKit

Apple полностью сломала классическую IDFA-атрибуцию, внедрив дифференциальную приватность (Differential Privacy).

#### Ключевые нововведения SKAN 4.0:
* **Fine Conversion Value (0-63):** 6-битное число для первого окна (0-48 часов).
* **Coarse Conversion Value:** три градации (Low, Medium, High), доступные даже при меньших объемах трафика.
* **3 Postback Windows:** возможность отслеживать когортный LTV вплоть до 35-го дня жизни пользователя в приложении.
    `,
  },
  {
    id: '10-3-anti-fraud-cloaking-account-farming-compliance',
    slug: '10-3-anti-fraud-cloaking-account-farming-compliance',
    courseSlug: 'media-buying',
    moduleId: 10,
    moduleTitle: 'Модуль 4: Server-Side Трекинг, CAPI & Privacy',
    lessonNumber: '4.3',
    title: 'Антифрод, архитектура клоакинга, фарминг аккаунтов и комплаенс рекламных сетей',
    level: 'Senior',
    readTimeMinutes: 11,
    targetAudience: 'Senior Media Buyers, Traffic Arbitrage Leads',
    summary:
      'Как устроены системы автоматической модерации и антифрода в Meta и Google (Policy Bots, Residential Proxies, Canvas Fingerprinting). Архитектура клоакинга: White Page vs Black Page, TDS фильтрация ботов и легальный комплаенс для сохранения стабильности инфраструктуры.',
    competencies: ['Enterprise Performance', 'Executive Leadership'],
    coreConcepts: [
      {
        title: 'Архитектура фильтрации трафика (Cloaking / TDS)',
        explanation:
          'Система разделения потоков пользователей: боты модерации и спай-сервисы направляются на White Page (соответствующую всем правилам платформы), а реальные целевые пользователи — на офферную Black Page.',
      },
      {
        title: 'Trust Score рекламного профиля (Account Warming)',
        explanation:
          'Набор метрик доверия алгоритма к Business Manager и Ad Account: история платежей, отсутствие резких скачков спенда, совпадение гео IP и биллинг-карты.',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Payment Settlement Fail Rate',
        industry: 'General',
        targetBenchmark: '0% (отсутствие биллинг-ошибок)',
        dangerZone: '> 1 фейла в месяц (мгновенный триггер Risk Payment Ban)',
        calculation: 'Число отклоненных транзакций банком / Всего попыток списания',
        seniorContext:
          'Даже один отклоненный платеж на $500 обрушивает Trust Score кабинета и может привести к вечной блокировке BM.',
      },
    ],
    researchInsights: [
      {
        source: 'AdTech Fraud & Security Lab',
        year: '2023',
        finding:
          'Более 85% блокировок в первые 7 дней запуска происходят не из-за текста креатива, а из-за несоответствия цифрового отпечатка (Browser Fingerprint, WebRTC leaks, некачественные прокси).',
        practicalTakeaway:
          'Используйте качественные антидетект-браузеры (Dolphin, AdsPower) с резидентскими или мобильными прокси строго того гео, на которое оформлен платежный метод.',
      },
    ],
    interviewCases: [
      {
        question:
          'Ваш аккаунт в Meta с расходом $5,000/день получил внезапный бан по пункту «Unacceptable Business Practices». Ваши пошаговые действия по апелляции и восстановлению трафика?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Хладнокровие, знание регламентов апелляций, наличие резервной инфраструктуры (Backup Ad Accounts, Agency Credit Lines).',
        antiPatternAnswer: '«Буду писать гневные сообщения в поддержку каждые 10 минут».',
        seniorBattleTestedAnswer:
          '«1) Немедленно активирую резервный Business Manager (Backup Setup), заранее прогретый и привязанный к параллельному пикселю через партнерский доступ, чтобы не останавливать поток лидов; 2) Провожу аудит лендинга: проверка ссылок на Privacy Policy, Terms of Service, контакты компании, отсутствие триггерных стоп-слов («гарантия 100%», «секретный метод», таймеры обратного отсчета); 3) Составляю структурированную апелляцию в саппорт: вежливый тон, подтверждение соответствия правилам, прикрепление сертификатов юрлица; 4) Если есть доступ к выделенному Meta Representative (Meta Client Partner), эскалирую кейс через внутренний тикет с ID кабинета».',
        probingQuestions: [
          'Как правильно прогревать агентские кредитные линии (Credit Lines)?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Обеспечил бесперебойность трафика на [X]%, построив инфраструктуру [Y]',
        template:
          'Спроектировал отказоустойчивую инфраструктуру рекламных кабинетов (Agency Accounts + Backup BMs), обеспечив {X}% аптайм спенда при масштабировании до ${Y}/мес.',
        concreteExample:
          'Развернул резервную мультиаккаунтную инфраструктуру с агентскими кредитными линиями, ликвидировав простои от случайных банов модерации и удержав среднемесячный спенд на уровне $180k.',
        keywords: ['Account Farming', 'Compliance', 'Risk Payment', 'TDS', 'Anti-Fraud'],
      },
    ],
    quizQuestions: [
      {
        id: '10-3-q1',
        question: 'Что является наиболее частой причиной мгновенной блокировки (Risk Payment) нового рекламного аккаунта?',
        options: [
          'Использование синего цвета в баннере',
          'Несоответствие страны выпуска банковской карты (BIN) и страны IP-адреса/аккаунта, либо резкий всплеск спенда',
          'Запуск кампании в выходной день',
          'Слишком длинный заголовок объявления',
        ],
        correctOptionIndex: 1,
        explanation: 'Антифрод системы отслеживает платежные аномалии: карта другой юрисдикции или скачок бюджета с $50 до $2000 вызывают автоматический лок.',
        commonMistake: 'Считают, что любые блокировки связаны исключительно с текстом объявления.',
      },
    ],
    longreadMarkdown: `
### Управление рисками: 3 уровня защиты медиабайера

\`\`\`
1. Инфраструктурный уровень:
   - Разделение профилей в антидетект-браузере.
   - Чистые резидентные прокси (SOCKS5/HTTP).
   - Надежные виртуальные карты с доверенными BIN (Visa/Mastercard Tier 1).

2. Контентный комплаенс:
   - Проверка текстов на стоп-слова (Banned Claims).
   - Наличие юридических документов в футере лендинга (Privacy, Cookie, Refund Policy).
   - Отсутствие агрессивных визуальных триггеров «До/После».

3. Резервный контур:
   - Пиксель расшарен на 2 резервных аккаунта.
   - Пост-айдишники (Post ID) сохранены в отдельной таблице для мгновенного перезапуска.
\`\`\`
    `,
  },
];
