import { Lesson } from '@/entities/lesson';

export const module7Lessons: Lesson[] = [
  {
    id: '7-1-blended-roas-mer-ncpa-breakeven',
    slug: '7-1-blended-roas-mer-ncpa-breakeven',
    courseSlug: 'media-buying',
    moduleId: 7,
    moduleTitle: 'Модуль 1: Аукционная эконометрика и Unit-экономика трафика',
    lessonNumber: '1.1',
    title: 'Blended ROAS, MER, nCPA и расчет предела безубыточности (Break-Even)',
    level: 'Senior',
    readTimeMinutes: 10,
    targetAudience: 'Senior Media Buyers, Performance Leads, UA Managers',
    summary:
      'Почему кабинетный ROAS (In-Platform ROAS) врет в 90% случаев из-за окон атрибуции и каннибализации. Математика расчета MER (Marketing Efficiency Ratio), когортного nCPA (New Customer CPA) и нахождение точки безубыточного скейлинга от маржинальности бизнеса.',
    competencies: ['Unit Economics & Finance', 'Data & A/B Rigor', 'Enterprise Performance'],
    coreConcepts: [
      {
        title: 'MER (Marketing Efficiency Ratio) / Blended ROAS',
        explanation:
          'Отношение всей чистой выручки компании к суммарному рекламному расходу по всем каналам. Защищает от самоприсвоения конверсий разными рекламными кабинетами (Meta + Google + TikTok).',
        formulas: [
          'MER = Total Net Revenue / Total Ad Spend Across All Channels',
          'Break-Even MER = 1 / Gross Margin %',
        ],
      },
      {
        title: 'nCPA (New Customer Acquisition Cost)',
        explanation:
          'Стоимость привлечения исключительно нового покупателя, очищенная от повторных транзакций текущей базы пользователей. Рассчитывается через сопоставление ID заказов из CRM.',
        formulas: ['nCPA = Ad Spend / First-Time Buyers Count'],
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Blended MER Safety Buffer',
        industry: 'E-commerce',
        targetBenchmark: '>= 3.0x (при марже 60-70%)',
        dangerZone: '< 1.8x (риск кассового разрыва)',
        calculation: 'Total Revenue / Total Ad Spend',
        seniorContext:
          'Сеньор-байер никогда не масштабирует кампанию только по Meta ROAS 4.0, если общий MER бизнеса падает ниже планового порога маржинальности.',
      },
      {
        metric: 'nCAC / Blended CAC Ratio',
        industry: 'General',
        targetBenchmark: '1.2x - 1.5x',
        dangerZone: '> 2.2x (кабинет привлекает только старых клиентов)',
        calculation: 'Cost per New Customer / In-Platform Cost per Purchase',
        seniorContext:
          'Если In-Platform CPA $25, а nCPA по когорте CRM $60, рекламная система оптимизируется на легкий ретаргетинг вместо притока свежей ликвидности.',
      },
    ],
    researchInsights: [
      {
        source: 'Meta Auction Economics & Harvard Business Review',
        year: '2023',
        finding:
          'До 42% конверсий, атрибутированных пикселем Meta с окном 7-day click / 1-day view, произошли бы органически без демонстрации рекламы (отсутствие инкрементальности).',
        practicalTakeaway:
          'Для жесткого контроля прибыльности необходимо переходить на окно 1-day click или 7-day click only, сверяя результат с общим трендом выручки в платежном шлюзе (Stripe/Shopify).',
      },
    ],
    interviewCases: [
      {
        question:
          'Ваш Media Buyer отчитался: в Meta Ads ROAS вырос с 2.5 до 4.2 при удвоении бюджета. Однако CFO заявляет, что денег на расчетном счете стало меньше. Что произошло и как вы это расследуете?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Понимание окон атрибуции (view-through), каннибализации брендового поиска и ретаргетинга, разницы между Gross Revenue и Net Cash Flow.',
        antiPatternAnswer:
          '«Наверное, пиксель поломался или в банке задержка клиринга платежей. Нужно подождать неделю».',
        seniorBattleTestedAnswer:
          '«Я немедленно сниму когортный отчет из CRM и сопоставлю In-Platform данные с MER и nCPA. Рост кабинетного ROAS при падении кассы — классический симптом каннибализации: алгоритм Meta переключился на теплую аудиторию (view-through конверсии людей, которые и так покупали) либо за счет динамического ретаргетинга выкупал существующую базу. Я проверю долю New vs Returning Customers, сокращу окно атрибуции до 1-day click, отключу аудитории Advantage+ Custom Audiences и рассчитаю реальный вклад в маржинальную прибыль через инкрементальный Geo-тест».',
        probingQuestions: [
          'Как вы рассчитываете Break-Even ROAS при динамической марже по категориям SKU?',
          'Какие исключения (exclusions) вы ставите в кампаниях Advantage+ Shopping?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Снизил [X] на [Y]%, увеличив маржинальную прибыль на [Z]',
        template:
          'Перестроил систему оптимизации медиабаинга с кабинетного ROAS на Blended MER и nCPA, снизив неинкрементальный расход на {Y}% и повысив Net Contribution Margin на ${Z}.',
        concreteExample:
          'Перестроил медиабаинг с бюджетом $180k/мес на модель Blended MER и когортный nCPA, снизив долю каннибализирующего ретаргетинга на 35% и увеличив чистую прибыль e-com направления на $64k/мес.',
        keywords: ['Blended ROAS', 'MER', 'nCPA', 'Contribution Margin', 'Attribution Cannibalization'],
      },
    ],
    caseStudies: [
      {
        companyName: 'Gymshark / Direct D2C Apparel',
        industry: 'E-commerce',
        scale: '$20M+ Annual Ad Spend',
        problem:
          'При масштабировании бюджета с $500k до $1.2M в месяц пиксель Meta показывал стабильный ROAS 3.2, но маржинальная прибыль компании упала на 18%.',
        strategicMove:
          'Внедрили единую эконометрическую панель MER и отключили ретаргетинговые сетки, переведя 90% бюджета в 100% холодный Broad с жестким исключением 180-дневных покупателей.',
        quantitativeResult:
          'MER восстановился с 1.9x до 2.7x, а прирост новых покупателей (New Customer Acquisition) увеличился на 44% при том же бюджете.',
        keyLesson:
          'Кабинетный ROAS — метрика оптимизации алгоритма, но финансовым ориентиром для масштабирования может быть только MER и чистый денежный поток.',
      },
    ],
    quizQuestions: [
      {
        id: '7-1-q1',
        question: 'Если валовая маржа (Gross Margin) продукта составляет 40%, чему равен минимальный безубыточный ROAS (Break-Even ROAS)?',
        options: ['1.4x', '2.0x', '2.5x', '4.0x'],
        correctOptionIndex: 2,
        explanation: 'Break-Even ROAS = 100% / Gross Margin% = 1 / 0.40 = 2.5x. Если ROAS ниже 2.5, бизнес несет убыток на каждой продаже.',
        commonMistake: 'Путают наценку (Markup) и маржу (Margin), либо ошибочно считают 1.4x (100% + 40%).',
      },
    ],
    longreadMarkdown: `
### Анатомия аукционной эконометрики: почему ROAS убивает бизнес

В среде performance-маркетинга существует иллюзия, что высокий ROAS в рекламном кабинете автоматически означает успех. На практике медиабайер с кабинетным ROAS 5.0x может банкротить компанию быстрее, чем специалист с ROAS 2.2x.

Причина кроется в фундаментальном конфликте интересов:
1. **Цель алгоритма Meta/Google:** максимизировать число атрибутированных конверсий в рамках выбранного окна (например, 7-day click + 1-day view), чтобы доказать свою ценность и побудить вас тратить больше.
2. **Цель бизнеса:** максимизировать чистый денежный приток (Free Cash Flow) за вычетом себестоимости товаров (COGS), эквайринга, логистики, возвратов и затрат на рекламу.

---

### Математическая модель безубыточности

\`\`\`
Выручка (Revenue) = 100$
Себестоимость + Логистика + Эквайринг (COGS) = 60$
Валовая прибыль (Gross Profit) = 40$ (Маржа 40%)

Break-Even CPA = Gross Profit на заказ = 40$
Break-Even ROAS = Revenue / Break-Even CPA = 100 / 40 = 2.5x
\`\`\`

Если ваш рекламный кабинет отчитывается о ROAS 2.2x, то на каждом заказе в 100$ вы тратите на рекламу 45.45$, при валовой прибыли 40$. Результат — **чистый операционный убыток -5.45$** на каждой привлеченной транзакции.

---

### Фреймворк перехода на MER и nCPA

1. **Ежедневный аудит MER (Marketing Efficiency Ratio):**
   $$MER = \\frac{\\text{Total Net Revenue (Stripe/Shopify)}}{\\text{Total Ad Spend (Meta + Google + TikTok)}}$$
2. **Изоляция New Customer CPA (nCPA):**
   Исключите из атрибуции пользователей, которые покупали за последние 365 дней. Реальный скейлинг бизнеса происходит исключительно через снижение nCPA при удержании стабильного LTV.
    `,
  },
  {
    id: '7-2-bidding-models-tcpa-troas-ecpm',
    slug: '7-2-bidding-models-tcpa-troas-ecpm',
    courseSlug: 'media-buying',
    moduleId: 7,
    moduleTitle: 'Модуль 1: Аукционная эконометрика и Unit-экономика трафика',
    lessonNumber: '1.2',
    title: 'Модели биддинга (tCPA, tROAS, Lowest Cost, Bid Cap) и математика eCPM',
    level: 'Senior',
    readTimeMinutes: 11,
    targetAudience: 'Senior Media Buyers, PPC Leads',
    summary:
      'Теория аукциона второй цены и аукциона VCG. Формула Total Value в Meta Ads и Ad Rank в Google Ads. Как работают стратегии Highest Volume, Cost Cap, Bid Cap и Target CPA/ROAS на больших суточных бюджетах ($10k+/день).',
    competencies: ['Unit Economics & Finance', 'Data & A/B Rigor'],
    coreConcepts: [
      {
        title: 'Meta Total Value Auction Formula',
        explanation:
          'Формула, по которой алгоритм определяет победителя аукциона за показ конкретному пользователю в ленте или Reels.',
        formulas: [
          'Total Value = [Advertiser Bid] × [Estimated Action Rate] + [User Value (Ad Quality & Relevance)]',
        ],
      },
      {
        title: 'Google Ad Rank Formula',
        explanation:
          'Рейтинг объявления в поисковой и контекстной выдаче Google Ads, определяющий позицию и фактическую цену за клик (Actual CPC).',
        formulas: [
          'Ad Rank = f(Max CPC / Target Bid, Quality Score, Expected CTR, Ad Relevance, Landing Page Experience, Format Impact)',
        ],
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Estimated Action Rate (eCTR × eCVR)',
        industry: 'General',
        targetBenchmark: 'Топ 20% аукциона (Above Average)',
        dangerZone: 'Bottom 35% (штрафной eCPM +40-80%)',
        calculation: 'Оценка вероятности целевого действия пользователя до показа',
        seniorContext:
          'Если креатив имеет слабый конверт, алгоритм взвинчивает eCPM в 2-3 раза, чтобы компенсировать низкий Estimated Action Rate рекламодателя.',
      },
    ],
    researchInsights: [
      {
        source: 'Meta Auction Architecture Whitepaper',
        year: '2022',
        finding:
          'Повышение User Quality Score креатива на 1 пункт снижает фактический eCPM в аукционе в среднем на 27% при неизменной ставке рекламодателя.',
        practicalTakeaway:
          'Лучший способ снизить CPA — не крутить ручные ставки (Bid Cap), а повышать конверсию посадочной страницы и вовлекающий Hook Rate креатива.',
      },
    ],
    interviewCases: [
      {
        question:
          'Вы запускаете кампанию с Cost Cap $30. Аукцион откручивает только 10% дневного бюджета. В чем причина и какие 3 сценария исправления вы примените?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Понимание механики отсечения аукциона через Cost Cap, связи со ставкой eCPM и конверсией креатива.',
        antiPatternAnswer: '«Meta глючит, скопирую адсет 10 раз и перезапущу с автобиддингом».',
        seniorBattleTestedAnswer:
          '«Причина в том, что при текущем Estimated Action Rate креатива и установленном Cost Cap $30 наш Total Value проигрывает конкурентам в аукционе — система просто не находит достаточно пользователей, которых можно сконвертировать дешевле $30. Сценарии исправления: 1) Временное повышение Cost Cap на 20-30% для сбора стартовых 50 событий и выхода из Learning Phase; 2) Запуск теста новых креативов с более высоким Hook Rate и CR лендинга, что поднимет Estimated Action Rate; 3) Параллельный запуск контрольной кампании Lowest Cost (Highest Volume) с бюджетным лимитом для калибровки реального рыночного CPA».',
        probingQuestions: [
          'В каких случаях вы предпочтете Bid Cap вместо Cost Cap?',
          'Что происходит с eCPM при резком увеличении дневного бюджета на 100%?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Снизил [X] на [Y]%, внедрив [Z]',
        template:
          'Оптимизировал алгоритмический биддинг через комбинацию Cost Cap и Value-Based Bidding (tROAS), снизив средний eCPM на {Y}% и стабилизировав дневной спенд на уровне ${Z}.',
        concreteExample:
          'Оптимизировал биддинг-стратегию в Google & Meta Ads, внедрив динамический Cost Cap на масштабах $5k/день, снизив волатильность CPA на 42% и увеличив объем квалифицированных лидов на 28%.',
        keywords: ['Bid Cap', 'Cost Cap', 'tROAS', 'eCPM', 'Total Value Auction'],
      },
    ],
    quizQuestions: [
      {
        id: '7-2-q1',
        question: 'Что произойдет, если в аукционе Meta у рекламодателя A ставка $50 при eCVR 1%, а у рекламодателя B ставка $25 при eCVR 3% (при равном User Value)?',
        options: [
          'Победит рекламодатель A, так как его ставка в 2 раза выше',
          'Победит рекламодатель B, так как его Total Value ($25 × 3% = 0.75) выше, чем у A ($50 × 1% = 0.50)',
          'Оба объявления получат одинаковое число показов',
          'Аукцион отменится из-за высокой конкуренции',
        ],
        correctOptionIndex: 1,
        explanation: 'Алгоритм максимизирует доход аукциона на 1000 показов: ставка умножается на вероятность действия. 25 × 0.03 = 0.75 > 50 × 0.01 = 0.50.',
        commonMistake: 'Ошибочно предполагать, что побеждает только максимальная ставка, забывая про вероятность совершения действия.',
      },
    ],
    longreadMarkdown: `
### Анатомия биддинга: заглядываем под капот аукциона

Большинство джуниоров считают, что реклама работает как рынок: кто больше заплатил, того и показали. На самом деле аукционы современных платформ (Meta, Google, TikTok) оптимизируют **долгосрочную ценность платформы (Total Value)**.

#### Формула победы в аукционе:
$$\\text{Total Value} = (\\text{Bid} \\times \\text{eCVR}) + \\text{Ad Quality Score}$$

Где:
* **Bid:** сколько рекламодатель готов заплатить за целевое действие.
* **eCVR (Estimated Conversion Rate):** историческая вероятность того, что конкретный пользователь совершит конверсию именно на вашем предложении.
* **Ad Quality Score:** реакция пользователей (скрытия, досмотры, переходы, скорость загрузки посадочной страницы).

---

### Сравнительный анализ стратегий управления ставками

| Стратегия | Принцип работы | Когда использовать | Риски |
|---|---|---|---|
| **Highest Volume (Lowest Cost)** | Выжимает максимальный объем конверсий в рамках бюджета | Тестирование креативов, быстрый прогрев пикселя | Рост CPA при выгорании аудитории |
| **Cost Cap** | Удерживает средний CPA вблизи заданной планки | Масштабирование рабочих связок | Недокрут бюджета, если капа слишком занижена |
| **Bid Cap** | Задает абсолютный потолок ставки в аукционе | Арбитраж трафика с жесткой юнит-экономикой | Резкая остановка показов при всплеске конкуренции |
| **Target ROAS (Value Bidding)** | Оптимизируется на корзины с максимальным чеком | E-commerce с большим разбросом AOV | Требует высокой плотности транзакций (>100 покупок/нед) |
    `,
  },
  {
    id: '7-3-incrementality-geo-lift-cannibalization',
    slug: '7-3-incrementality-geo-lift-cannibalization',
    courseSlug: 'media-buying',
    moduleId: 7,
    moduleTitle: 'Модуль 1: Аукционная эконометрика и Unit-экономика трафика',
    lessonNumber: '1.3',
    title: 'Инкрементальность трафика, Geo-Lift тесты и устранение каннибализации',
    level: 'Lead',
    readTimeMinutes: 12,
    targetAudience: 'Performance Leads, Heads of UA, Growth Directors',
    summary:
      'Методология проведения инкрементальных экспериментов: Matched Markets, Synthetic Controls, Geo-Lift тесты. Как доказать реальный вклад платных каналов (iROAS) и прекратить платить за пользователей, которые сконвертировались бы бесплатно.',
    competencies: ['Attribution & MMM', 'Data & A/B Rigor', 'Unit Economics & Finance'],
    coreConcepts: [
      {
        title: 'Инкрементальность (Incrementality / iROAS)',
        explanation:
          'Доля продаж, которая возникла строго благодаря воздействию рекламной кампании и не произошла бы естественным путем (базовый органический спрос).',
        formulas: [
          'Incremental Lift = (Conversions_Test - Conversions_Control) / Conversions_Control',
          'iROAS = Incremental Revenue / Ad Spend',
        ],
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Brand Search Incrementality',
        industry: 'E-commerce',
        targetBenchmark: '>= 35%',
        dangerZone: '< 15% (85%+ кликов по бренду — пустой слив бюджета)',
        calculation: 'Incremental Lift при отключении брендового контекста',
        seniorContext:
          'Если при отключении рекламы по собственному бренду органика забирает 90% трафика без падения выручки, отключение дает чистую экономию бюджета.',
      },
    ],
    researchInsights: [
      {
        source: 'eBay Research Lab & University of Chicago (Tadelis et al.)',
        year: '2015',
        finding:
          'Отключение платной поисковой рекламы по брендовым запросам eBay не привело к статистически значимому падению продаж: пользователи просто кликали на первую органическую ссылку.',
        practicalTakeaway:
          'Брендовый контекст имеет смысл держать включенным только при наличии активных конкурентов, выкупающих ваш бренд (Conquesting).',
      },
    ],
    interviewCases: [
      {
        question:
          'Как спроектировать Geo-Lift эксперимент, чтобы доказать инкрементальность YouTube и Meta кампаний с бюджетом $100k/мес?',
        difficulty: 'Director',
        whatInterviewerLooksFor:
          'Методология подбора парных гео-регионов (Matched Markets), расчет MDE (Minimum Detectable Effect), учет сезонности и синтетический контроль.',
        antiPatternAnswer: '«Выключим рекламу на неделю по всей стране и посмотрим, упадут ли продажи».',
        seniorBattleTestedAnswer:
          '«Я применю метод Matched Market Testing или библиотеку GeoLift (Meta Open Source). 1) Разобью страну на 40-60 DMA или регионов; 2) На исторических данных за 12 месяцев рассчитаю корреляцию и коинтеграцию регионов для формирования пар Test/Control; 3) Рассчитаю MDE, чтобы убедиться, что бюджет $100k обеспечит статистическую мощность >80%; 4) В тестовой группе регионов увеличим или отключим спенд, контрольную оставим без изменений; 5) По окончании теста через Synthetic Control оценим p-value и чистый iROAS».',
        probingQuestions: [
          'Что такое Spillover эффект в Geo-тестах и как его минимизировать?',
          'Как интерпретировать iROAS, равный 0.8x, при кабинетном ROAS 2.5x?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Сэкономил [X]$ бюджета, проведя [Y] и выявив [Z]',
        template:
          'Спроектировал и провел общенациональный Geo-Lift эксперимент, выявивший каннибализацию органики на {Y}%, что позволило перераспределить ${X} неэффективного спенда в высокоинкрементальные каналы.',
        concreteExample:
          'Реализовал Matched-Market Geo-Lift тестирование на базе 50 регионов, доказав нулевую инкрементальность брендового контекста в Google и сэкономив компании $140,000 годового бюджета.',
        keywords: ['Incrementality', 'Geo-Lift', 'Matched Markets', 'Synthetic Control', 'iROAS'],
      },
    ],
    quizQuestions: [
      {
        id: '7-3-q1',
        question: 'Что показывает метрика iROAS (Incremental ROAS)?',
        options: [
          'ROAS с учетом повторных покупок за 30 дней',
          'Отношение прироста выручки, вызванного исключительно рекламой, к затратам на нее',
          'ROAS, рассчитанный рекламным кабинетом с окном 7-day click',
          'Отношение валовой выручки к суммарным расходам компании',
        ],
        correctOptionIndex: 1,
        explanation: 'iROAS изолирует органический базовый уровень и оценивает выручку, которая исчезла бы при отключении кампании.',
        commonMistake: 'Путают iROAS с Blended ROAS или LTV ROAS.',
      },
    ],
    longreadMarkdown: `
### Проблема атрибуции: кто на самом деле генерирует продажи?

Когда вы запускаете рекламу, рекламный пиксель регистрирует транзакцию, если пользователь хотя бы раз увидел объявление. Но совершил ли он покупку **благодаря рекламе** или **купил бы в любом случае**?

#### Категории трафика по инкрементальности:
1. **Never Buyers:** никогда не купят, сколько рекламу ни показывай.
2. **Sure Things (Органика):** купят в любом случае (лояльные клиенты, люди с прямым намерением).
3. **Persuadables (Инкрементальные клиенты):** купят **только если** увидят рекламу. Это единственная группа, за которую имеет смысл платить!
4. **Lost Causes:** кликнут из любопытства, потратят бюджет и уйдут.

---

### Архитектура Geo-Lift тестирования

\`\`\`
Шаг 1: Сбор исторических данных по регионам (6-12 месяцев).
Шаг 2: Кластеризация и поиск коинтегрированных пар (например, Казань <-> Самара, Остин <-> Денвер).
Шаг 3: Формирование контрольной группы (Cell A) и тестовой группы (Cell B).
Шаг 4: Тестовое воздействие (Lift / Holdout) на протяжении 4-6 недель.
Шаг 5: Оценка с помощью синтетического контроля: 
        iROAS = (Δ Test Revenue - Δ Control Revenue) / Spend
\`\`\`
    `,
  },
];
