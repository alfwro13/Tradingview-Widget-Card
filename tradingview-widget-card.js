let LitElement;
let html;
let css;
{
  const HaLitBase = window.LitElement || (customElements.get("ha-panel-lovelace") ? Object.getPrototypeOf(customElements.get("ha-panel-lovelace")) : null);
  if (!HaLitBase || !HaLitBase.prototype || !HaLitBase.prototype.html || !HaLitBase.prototype.css) {
    const msg = "tradingview-widget-card: Lit not found. This card must run inside Home Assistant.";
    console.error(msg);
    throw new Error(msg);
  }
  LitElement = HaLitBase;
  html = HaLitBase.prototype.html;
  css = HaLitBase.prototype.css;
}

// --- CONSTANTS & CONFIGURATIONS ---

const WIDGET_CONFIGS = {
  "ticker-tape": { baseUrl: "https://s.tradingview.com/embed-widget/ticker-tape/" },
  "tickers": { baseUrl: "https://www.tradingview-widget.com/embed-widget/tickers/" },
  "single-quote": { baseUrl: "https://www.tradingview-widget.com/embed-widget/single-quote/" },
  "stock-heatmap": { baseUrl: "https://www.tradingview-widget.com/embed-widget/stock-heatmap/" },
  "etf-heatmap": { baseUrl: "https://www.tradingview-widget.com/embed-widget/etf-heatmap/" },
  "forex-heat-map": { baseUrl: "https://www.tradingview-widget.com/embed-widget/forex-heat-map/" },
  "forex-cross-rates": { baseUrl: "https://www.tradingview-widget.com/embed-widget/forex-cross-rates/" },
  "technical-analysis": { baseUrl: "https://www.tradingview-widget.com/embed-widget/technical-analysis/" },
  "economic-calendar": { baseUrl: "https://www.tradingview-widget.com/embed-widget/events/" },
  "news": { baseUrl: "https://www.tradingview-widget.com/embed-widget/timeline/" },
  "market-overview": { baseUrl: "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js" },
  "stock-market-hotlists": { baseUrl: "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js" },
  "market-quotes": { baseUrl: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js" }
};

const HOTLIST_EXCHANGES = [
  { l: "USA (US Exchanges)", v: "US Exchanges" }, { l: "USA (NASDAQ)", v: "NASDAQ" }, { l: "USA (NYSE)", v: "NYSE" },
  { l: "USA (NYSE ARCA)", v: "NYSE ARCA" }, { l: "USA (OTC)", v: "OTC" }, { l: "Turkey (BIST)", v: "BIST" },
  { l: "Argentina (BYMA)", v: "BYMA" }, { l: "Australia (ASX)", v: "ASX" }, { l: "Austria (VIE)", v: "VIE" },
  { l: "Brazil (BMFBOVESPA)", v: "BMFBOVESPA" }, { l: "Canada (CSE)", v: "CSE" }, { l: "Canada (NEO)", v: "NEO" },
  { l: "Canada (TSX)", v: "TSX" }, { l: "Canada (TSXV)", v: "TSXV" }, { l: "Chile (BCS)", v: "BCS" },
  { l: "Colombia (BVC)", v: "BVC" }, { l: "Cyprus (CSECY)", v: "CSECY" }, { l: "Czech Republic (PSECZ)", v: "PSECZ" },
  { l: "Denmark (OMXCOP)", v: "OMXCOP" }, { l: "Egypt (EGX)", v: "EGX" }, { l: "Estonia (OMXTSE)", v: "OMXTSE" },
  { l: "Finland (OMXHEX)", v: "OMXHEX" }, { l: "Germany (BER)", v: "BER" }, { l: "Germany (DUS)", v: "DUS" },
  { l: "Germany (FWB)", v: "FWB" }, { l: "Germany (HAM)", v: "HAM" }, { l: "Germany (HAN)", v: "HAN" },
  { l: "Germany (LS)", v: "LS" }, { l: "Germany (LSX)", v: "LSX" }, { l: "Germany (MUN)", v: "MUN" },
  { l: "Germany (SWB)", v: "SWB" }, { l: "Germany (TRADEGATE)", v: "TRADEGATE" }, { l: "Germany (XETR)", v: "XETR" },
  { l: "Greece (ATHEX)", v: "ATHEX" }, { l: "Hungary (BET)", v: "BET" }, { l: "Iceland (OMXICE)", v: "OMXICE" },
  { l: "India (BSE)", v: "BSE" }, { l: "Indonesia (IDX)", v: "IDX" }, { l: "Israel (TASE)", v: "TASE" },
  { l: "Italy (EUROTLX)", v: "EUROTLX" }, { l: "Italy (MIL)", v: "MIL" }, { l: "Kuwait (KSE)", v: "KSE" },
  { l: "Latvia (OMXRSE)", v: "OMXRSE" }, { l: "Lithuania (OMXVSE)", v: "OMXVSE" }, { l: "Mainland China (SSE)", v: "SSE" },
  { l: "Mexico (BIVA)", v: "BIVA" }, { l: "Morocco (CSEMA)", v: "CSEMA" }, { l: "Poland (GPW)", v: "GPW" },
  { l: "Poland (NEWCONNECT)", v: "NEWCONNECT" }, { l: "Russia (RUS)", v: "RUS" }, { l: "South Korea (KRX)", v: "KRX" },
  { l: "Spain (BME)", v: "BME" }, { l: "Sri Lanka (CSELK)", v: "CSELK" }, { l: "Sweden (OMXSTO)", v: "OMXSTO" },
  { l: "Switzerland (BX)", v: "BX" }, { l: "Switzerland (SIX)", v: "SIX" }, { l: "Taiwan, China (TPEX)", v: "TPEX" },
  { l: "UAE (ADX)", v: "ADX" }, { l: "United Kingdom (AQUIS)", v: "AQUIS" }, { l: "Venezuela (BVCV)", v: "BVCV" },
  { l: "Vietnam (HNX)", v: "HNX" }, { l: "Vietnam (UPCOM)", v: "UPCOM" }
];

const FOREX_CURRENCIES = ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD", "CNY", "TRY", "NOK", "SEK", "DKK", "ZAR", "HKD", "SGD", "MXN", "THB", "IDR", "KRW", "PLN", "ISK", "AED", "KWD", "RUB", "ILS", "ARS", "COP", "CLP", "PEN", "UYU"];

const COUNTRIES_FOR_ECONOMIC_CALENDAR = [
  { name: "Top 20 Economies", code: "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu" }, { name: "USA", code: "us" },
  { name: "Canada", code: "ca" }, { name: "Austria", code: "at" }, { name: "Belgium", code: "be" },
  { name: "Cyprus", code: "cy" }, { name: "Czech Republic", code: "cz" }, { name: "Denmark", code: "dk" },
  { name: "Estonia", code: "ee" }, { name: "European Union", code: "eu" }, { name: "Finland", code: "fi" },
  { name: "France", code: "fr" }, { name: "Germany", code: "de" }, { name: "Greece", code: "gr" },
  { name: "Hungary", code: "hu" }, { name: "Iceland", code: "is" }, { name: "Ireland", code: "ie" },
  { name: "Italy", code: "it" }, { name: "Latvia", code: "lv" }, { name: "Lithuania", code: "lt" },
  { name: "Luxembourg", code: "lu" }, { name: "Netherlands", code: "nl" }, { name: "Norway", code: "no" },
  { name: "Poland", code: "pl" }, { name: "Portugal", code: "pt" }, { name: "Romania", code: "ro" },
  { name: "Russia", code: "ru" }, { name: "Serbia", code: "rs" }, { name: "Slovakia", code: "sk" },
  { name: "Spain", code: "es" }, { name: "Sweden", code: "se" }, { name: "Switzerland", code: "ch" },
  { name: "Ukraine", code: "ua" }, { name: "United Kingdom", code: "gb" }, { name: "Angola", code: "ao" },
  { name: "Bahrain", code: "bh" }, { name: "Botswana", code: "bw" }, { name: "Egypt", code: "eg" },
  { name: "Ethiopia", code: "et" }, { name: "Ghana", code: "gh" }, { name: "Israel", code: "il" },
  { name: "Kenya", code: "ke" }, { name: "Kuwait", code: "kw" }, { name: "Malawi", code: "mw" },
  { name: "Mauritius", code: "mu" }, { name: "Morocco", code: "ma" }, { name: "Mozambique", code: "mz" },
  { name: "Namibia", code: "na" }, { name: "Nigeria", code: "ng" }, { name: "Oman", code: "om" },
  { name: "Qatar", code: "qa" }, { name: "Rwanda", code: "rw" }, { name: "Saudi Arabia", code: "sa" },
  { name: "Seychelles", code: "sc" }, { name: "South Africa", code: "za" }, { name: "Tanzania", code: "tz" },
  { name: "Tunisia", code: "tn" }, { name: "Turkey", code: "tr" }, { name: "Uganda", code: "ug" },
  { name: "United Arab Emirates", code: "ae" }, { name: "Zambia", code: "zm" }, { name: "Zimbabwe", code: "zw" },
  { name: "Argentina", code: "ar" }, { name: "Australia", code: "au" }, { name: "Bangladesh", code: "bd" },
  { name: "Brazil", code: "br" }, { name: "Chile", code: "cl" }, { name: "Colombia", code: "co" },
  { name: "Mainland China", code: "cn" }, { name: "Hong Kong, China", code: "hk" }, { name: "India", code: "in" },
  { name: "Indonesia", code: "id" }, { name: "Japan", code: "jp" }, { name: "South Korea", code: "kr" },
  { name: "Sri Lanka", code: "lk" }, { name: "Malaysia", code: "my" }, { name: "Mexico", code: "mx" },
  { name: "New Zealand", code: "nz" }, { name: "Pakistan", code: "pk" }, { name: "Peru", code: "pe" },
  { name: "Philippines", code: "ph" }, { name: "Singapore", code: "sg" }, { name: "Taiwan, China", code: "tw" },
  { name: "Thailand", code: "th" }, { name: "Venezuela", code: "ve" }, { name: "Vietnam", code: "vn" }
];

const ECONOMIC_CALENDAR_DEFAULT = {
  widget_type: "economic-calendar",
  height: "600px",
  country_filter: undefined,
  title: "",
  color_theme: "dark",
  locale: "en",
  width: "100%",
  is_transparent: false
};

const WIDGET_DEFAULTS_TEMP = {
  "ticker-tape": {
    widget_type: "ticker-tape",
    title: "",
    pairs: ["OANDA:USDTRY", "OANDA:EURTRY", "BINANCE:BTCUSDTPERP", "BIST:XU100"],
    show_symbol_logo: true,
    is_transparent: false,
    display_mode: "regular",
    height: "50px",
    width: "100%",
    color_theme: "dark",
    locale: "en"
  },
  tickers: {
    widget_type: "tickers",
    title: "",
    pairs: ["NASDAQ:AAPL", "NASDAQ:GOOGL", "NASDAQ:MSFT"],
    height: "75px",
    width: "100%",
    show_symbol_logo: true,
    color_theme: "dark",
    locale: "en",
    is_transparent: false
  },
  "single-quote": {
    widget_type: "single-quote",
    title: "",
    pairs: ["OANDA:USDTRY"],
    is_transparent: false,
    height: "100px",
    width: "100%",
    color_theme: "dark",
    locale: "en"
  },
  "stock-heatmap": {
    widget_type: "stock-heatmap",
    title: "",
    data_source: "SPX500",
    height: "500px",
    width: "100%",
    exchange: "",
    grouping: "sector",
    block_size: "market_cap_basic",
    block_color: "change",
    has_top_bar: false,
    is_zoom_enabled: true,
    has_symbol_tooltip: true,
    is_data_set_enabled: false,
    is_mono_size: true,
    color_theme: "dark",
    locale: "en"
  },
  "etf-heatmap": {
    widget_type: "etf-heatmap",
    title: "",
    data_source: "AllUSEtf",
    height: "500px",
    grouping: "asset_class",
    block_size: "volume",
    block_color: "change",
    has_top_bar: false,
    is_zoom_enabled: true,
    has_symbol_tooltip: true,
    is_data_set_enabled: false,
    is_mono_size: false,
    locale: "en",
    color_theme: "dark",
    width: "100%"
  },
  "forex-cross-rates": {
    widget_type: "forex-cross-rates",
    title: "",
    currencies: ["EUR", "USD", "GBP", "JPY", "CHF", "CAD", "TRY"],
    color_theme: "dark",
    locale: "en",
    background_color: "#000000",
    width: "100%",
    height: "100%"
  },
  "forex-heat-map": {
    widget_type: "forex-heat-map",
    currencies: ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD"],
    title: "",
    color_theme: "dark",
    locale: "en",
    is_transparent: false,
    background_color: "#000000",
    width: "100%",
    height: "300px"
  },
  "technical-analysis": {
    widget_type: "technical-analysis",
    title: "",
    pairs: ["BINANCE:BTCUSDT"],
    interval: "1D",
    height: "100%",
    width: "100%",
    show_interval_tabs: true,
    is_transparent: false,
    display_mode: "single",
    locale: "en",
    color_theme: "dark"
  },
  "economic-calendar": ECONOMIC_CALENDAR_DEFAULT,
  news: {
    widget_type: "news",
    title: "",
    display_mode: "adaptive",
    feed_mode: "all_symbols",
    height: "450px",
    color_theme: "dark",
    locale: "en",
    width: "100%",
    is_transparent: false
  },
  "market-overview": {
    widget_type: "market-overview",
    title: "",
    height: "550px",
    width: "100%",
    color_theme: "dark",
    locale: "en",
    date_range: "12M",
    show_chart: true,
    show_floating_tooltip: true,
    is_transparent: true,
    tab_config: "Crypto:\n - BINANCE:BTCUSDT\n - BINANCE:ETHUSDT\nStock:\n - NASDAQ:AAPL\n - NASDAQ:TSLA\nIndices:\n- INDEX:NKY"
  },
  "stock-market-hotlists": {
    widget_type: "stock-market-hotlists",
    title: "",
    height: "550px",
    width: "100%",
    exchange: "US Exchanges",
    date_range: "12M",
    show_chart: true,
    show_floating_tooltip: true,
    is_transparent: true,
    color_theme: "dark",
    locale: "en"
  },
  "market-quotes": {
    widget_type: "market-quotes",
    title: "",
    height: "550px",
    width: "100%",
    show_symbol_logo: true,
    is_transparent: true,
    color_theme: "dark",
    locale: "en",
    tab_config: "Indices:\n - FOREXCOM:SPXUSD\n - FOREXCOM:NSXUSD\nFutures:\n - BMFBOVESPA:ISP1!\n - CMCMARKETS:GOLD"
  }
};

// --- MAIN CARD COMPONENT ---

class TradingViewWidgetCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  
  _showError(errorMsg) {
    this.shadowRoot.innerHTML = `
      <ha-card style="padding: 16px; background-color: #ffebee; color: #c62828;">
        <b>TradingView Widget Error:</b> ${errorMsg}
      </ha-card>
    `;
  }

  setConfig(config) {
    if (!config || !config.widget_type) {
      this._showError("Widget type must be specified.");
      return;
    }
    
    this._config = config;
    const shadow = this.shadowRoot;
    
    let card = shadow.querySelector("ha-card");
    let iframe = shadow.querySelector("iframe");

    if (!card || !iframe) {
      shadow.innerHTML = "";
      card = document.createElement("ha-card");
      iframe = document.createElement("iframe");
      iframe.style.border = "0";
      iframe.setAttribute("scrolling", "no");
      iframe.setAttribute("allowtransparency", "true");
      iframe.setAttribute("frameborder", "0");
      card.appendChild(iframe);
      shadow.appendChild(card);
    }

    const widgetType = config.widget_type;
    
    if (config.title) {
      card.header = config.title;
    } else {
      card.header = "";
    }

    iframe.style.width = config.width || "100%";
    const isAdvancedWidget = ["news", "market-overview", "stock-market-hotlists", "market-quotes"].includes(widgetType);
    iframe.style.height = config.height || (isAdvancedWidget ? "550px" : "100%");

    let newSrc = "";

    if (isAdvancedWidget) {
      const baseOptions = {
        colorTheme: config.color_theme || "dark",
        isTransparent: config.is_transparent || false,
        width: "100%",
        height: "100%",
        locale: config.locale || "en"
      };
      let widgetOptions = baseOptions;
      let scriptUrl = "";
      if (widgetType === "news") {
        scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
        widgetOptions.displayMode = config.display_mode || "adaptive";
        if (config.feed_mode === "market" && config.market) {
          widgetOptions.feedMode = "market";
          widgetOptions.market = config.market;
        } else if (config.feed_mode === "symbol" && config.symbol) {
          widgetOptions.feedMode = "symbol";
          widgetOptions.symbol = config.symbol;
        } else {
          widgetOptions.feedMode = "all_symbols";
        }
      } else if (widgetType === "market-overview") {
        scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
        widgetOptions.dateRange = config.date_range || "12M";
        widgetOptions.showChart = config.show_chart !== false;
        widgetOptions.showFloatingTooltip = config.show_floating_tooltip !== false;
        widgetOptions.plotLineColorGrowing = "rgba(41, 98, 255, 1)";
        widgetOptions.plotLineColorFalling = "rgba(41, 98, 255, 1)";
        widgetOptions.gridLineColor = "rgba(240, 243, 250, 0)";
        widgetOptions.scaleFontColor = "rgba(120, 123, 134, 1)";
        widgetOptions.belowLineFillColorGrowing = "rgba(41, 98, 255, 0.12)";
        widgetOptions.belowLineFillColorFalling = "rgba(41, 98, 255, 0.12)";
        widgetOptions.belowLineFillColorGrowingBottom = "rgba(41, 98, 255, 0)";
        widgetOptions.belowLineFillColorFallingBottom = "rgba(41, 98, 255, 0)";
        widgetOptions.symbolActiveColor = "rgba(41, 98, 255, 0.12)";
        if (config.tab_config) {
          widgetOptions.tabs = this._parseTabsConfig(config.tab_config);
        } else {
          widgetOptions.tabs = [{
            title: "Indices",
            symbols: [{ s: "FOREXCOM:SPXUSD", d: "S&P 500" }, { s: "FOREXCOM:NSXUSD", d: "US 100" }, { s: "FOREXCOM:DJI", d: "Dow 30" }, { s: "INDEX:NKY", d: "Nikkei 225" }, { s: "INDEX:DEU40", d: "DAX Index" }, { s: "FOREXCOM:UKXGBP", d: "FTSE 100" }]
          }, {
            title: "Futures",
            symbols: [{ s: "BMFBOVESPA:ISP1!", d: "S&P 500" }, { s: "BMFBOVESPA:EUR1!", d: "Euro" }, { s: "CMCMARKETS:GOLD", d: "Gold" }, { s: "PYTH:WTI3!", d: "WTI Crude Oil" }]
          }, {
            title: "Forex",
            symbols: [{ s: "FX:EURUSD", d: "EUR/USD" }, { s: "FX:GBPUSD", d: "GBP/USD" }, { s: "FX:USDJPY", d: "USD/JPY" }, { s: "FX:USDCHF", d: "USD/CHF" }, { s: "FX:AUDUSD", d: "AUD/USD" }, { s: "FX:USDCAD", d: "USD/CAD" }]
          }];
        }
      } else if (widgetType === "stock-market-hotlists") {
        scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js";
        widgetOptions.exchange = config.exchange || "US Exchanges";
        widgetOptions.dateRange = config.date_range || "12M";
        widgetOptions.showChart = config.show_chart !== false;
        widgetOptions.showFloatingTooltip = config.show_floating_tooltip !== false;
        widgetOptions.plotLineColorGrowing = "rgba(41, 98, 255, 1)";
        widgetOptions.plotLineColorFalling = "rgba(41, 98, 255, 1)";
        widgetOptions.gridLineColor = "rgba(240, 243, 250, 0)";
        widgetOptions.scaleFontColor = "rgba(120, 123, 134, 1)";
        widgetOptions.belowLineFillColorGrowing = "rgba(41, 98, 255, 0.12)";
        widgetOptions.belowLineFillColorFalling = "rgba(41, 98, 255, 0.12)";
        widgetOptions.belowLineFillColorGrowingBottom = "rgba(41, 98, 255, 0)";
        widgetOptions.belowLineFillColorFallingBottom = "rgba(41, 98, 255, 0)";
        widgetOptions.symbolActiveColor = "rgba(41, 98, 255, 0.12)";
        widgetOptions.showSymbolLogo = false;
        widgetOptions.largeChartUrl = "";
      } else if (widgetType === "market-quotes") {
        scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
        widgetOptions.showSymbolLogo = config.show_symbol_logo !== false;
        if (config.tab_config) {
          const parsedTabs = this._parseTabsConfig(config.tab_config);
          if (parsedTabs) {
            widgetOptions.symbolsGroups = parsedTabs.map(tab => ({
              name: tab.title,
              symbols: tab.symbols.map(symbolObj => ({ name: symbolObj.s }))
            }));
          }
        } else {
          widgetOptions.symbolsGroups = [{
            name: "Indices",
            symbols: [{ name: "FOREXCOM:SPXUSD", displayName: "S&P 500 Index" }, { name: "FOREXCOM:NSXUSD", displayName: "US 100 Cash CFD" }, { name: "FOREXCOM:DJI", displayName: "Dow Jones Industrial Average Index" }, { name: "INDEX:NKY", displayName: "Japan 225" }, { name: "INDEX:DEU40", displayName: "DAX Index" }, { name: "FOREXCOM:UKXGBP", displayName: "FTSE 100 Index" }]
          }, {
            name: "Futures",
            symbols: [{ name: "BMFBOVESPA:ISP1!", displayName: "S&P 500" }, { name: "BMFBOVESPA:EUR1!", displayName: "Euro" }, { name: "CMCMARKETS:GOLD", displayName: "Gold" }, { name: "PYTH:WTI3!", displayName: "WTI Crude Oil" }, { name: "BMFBOVESPA:CCM1!", displayName: "Corn" }]
          }, {
            name: "Bonds",
            symbols: [{ name: "EUREX:FGBL1!", displayName: "Euro Bund" }, { name: "EUREX:FBTP1!", displayName: "Euro BTP" }, { name: "EUREX:FGBM1!", displayName: "Euro BOBL" }]
          }, {
            name: "Forex",
            symbols: [{ name: "FX:EURUSD", displayName: "EUR to USD" }, { name: "FX:GBPUSD", displayName: "GBP to USD" }, { name: "FX:USDJPY", displayName: "USD to JPY" }, { name: "FX:USDCHF", displayName: "USD to CHF" }, { name: "FX:AUDUSD", displayName: "AUD to USD" }, { name: "FX:USDCAD", displayName: "USD to CAD" }]
          }];
        }
      }
      const htmlStr = `
        <html>
          <head>
            <style>body { margin: 0; overflow: hidden; }</style>
          </head>
          <body>
            <div class="tradingview-widget-container">
              <div class="tradingview-widget-container__widget"></div>
              <script type="text/javascript" src="${scriptUrl}" async>
              ${JSON.stringify(widgetOptions, null, 2)}
              </script>
            </div>
          </body>
        </html>`;
      newSrc = "data:text/html;charset=utf-8," + encodeURIComponent(htmlStr);
    } else {
      const activeWidgetConfig = WIDGET_CONFIGS[widgetType];
      const baseStandardOptions = {
        colorTheme: config.color_theme || "dark",
        width: config.width || "100%",
        height: config.height || "100%",
        isTransparent: config.is_transparent || false
      };
      const standardWidgetOptions = baseStandardOptions;
      switch (widgetType) {
        case "forex-cross-rates":
        case "forex-heat-map":
          standardWidgetOptions.currencies = config.currencies;
          standardWidgetOptions.backgroundColor = config.background_color;
          standardWidgetOptions.isMonoSize = config.is_mono_size || false;
          break;
        case "stock-heatmap":
        case "etf-heatmap":
          standardWidgetOptions.dataSource = config.data_source;
          standardWidgetOptions.blockSize = config.block_size || (widgetType === "stock-heatmap" ? "market_cap_basic" : "volume");
          standardWidgetOptions.blockColor = config.block_color || "change";
          standardWidgetOptions.grouping = config.grouping || (widgetType === "stock-heatmap" ? "sector" : "asset_class");
          standardWidgetOptions.isMonoSize = config.is_mono_size || false;
          if (widgetType === "stock-heatmap") {
            standardWidgetOptions.exchange = config.exchange || "";
          }
          standardWidgetOptions.hasTopBar = config.has_top_bar;
          standardWidgetOptions.isZoomEnabled = config.is_zoom_enabled;
          standardWidgetOptions.hasSymbolTooltip = config.has_symbol_tooltip;
          standardWidgetOptions.isDataSetEnabled = config.is_data_set_enabled;
          break;
        case "single-quote":
        case "technical-analysis":
          standardWidgetOptions.symbol = String(config.pairs[0]);
          if (widgetType === "technical-analysis") {
            standardWidgetOptions.interval = config.interval || "1D";
            standardWidgetOptions.showIntervalTabs = config.show_interval_tabs !== false;
            standardWidgetOptions.displayMode = config.display_mode || "single";
          }
          break;
        case "economic-calendar":
          standardWidgetOptions.countryFilter = config.country_filter || undefined;
          standardWidgetOptions.importanceFilter = config.importance_filter || "-1,0,1";
          break;
        case "tickers":
        case "ticker-tape":
          standardWidgetOptions.symbols = config.pairs.map(pair => typeof pair === "object" && pair.proName && pair.title ? {
            proName: pair.proName,
            title: pair.title
          } : {
            proName: String(pair),
            title: String(pair).split(":").pop()
          });
          standardWidgetOptions.showSymbolLogo = config.show_symbol_logo !== false;
          standardWidgetOptions.largeChartUrl = config.large_chart_url || "";
          if (widgetType === "ticker-tape") {
            standardWidgetOptions.displayMode = config.display_mode || "adaptive";
          }
          break;
      }
      Object.keys(standardWidgetOptions).forEach(key => {
        if (standardWidgetOptions[key] === undefined) {
          delete standardWidgetOptions[key];
        }
      });
      newSrc = activeWidgetConfig.baseUrl + "?locale=" + (config.locale || "en") + "#" + encodeURIComponent(JSON.stringify(standardWidgetOptions));
    }

    if (iframe.getAttribute("src") !== newSrc) {
      iframe.setAttribute("src", newSrc);
    }
  }
  _parseTabsConfig(tabsConfigStr) {
    const parsedTabsList = [];
    let currentTab = null;
    const lines = tabsConfigStr.split("\n");
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        return;
      }
      if (trimmedLine.endsWith(":")) {
        const tabTitle = trimmedLine.slice(0, -1);
        const newTabObj = {
          title: tabTitle,
          originalTitle: tabTitle,
          symbols: []
        };
        currentTab = newTabObj;
        parsedTabsList.push(currentTab);
      } else if (trimmedLine.startsWith("-") && currentTab) {
        let symbolName = trimmedLine.substring(1).trim();
        if (symbolName) {
          currentTab.symbols.push({
            s: symbolName
          });
        }
      }
    });
    if (parsedTabsList.length > 0) {
      return parsedTabsList;
    } else {
      return null;
    }
  }
  getCardSize() {
    if (!this._config) {
      return 1;
    }
    const config = this._config;
    if (["news", "market-overview", "stock-market-hotlists", "market-quotes"].includes(config.widget_type)) {
      return 10;
    }
    const heightStr = config.height;
    const isHeatmap = ["stock-heatmap", "etf-heatmap"].includes(config.widget_type);
    let heightVal = 0;
    if (typeof heightStr === "string" && heightStr.endsWith("px")) {
      heightVal = parseFloat(heightStr);
    } else if (typeof heightStr === "string" && heightStr.endsWith("%")) {
      heightVal = isHeatmap ? 400 : 500;
    } else {
      heightVal = parseFloat(heightStr) || (isHeatmap ? 400 : 50);
    }
    return Math.max(1, Math.ceil(heightVal / 50));
  }
  set hass(hass) {}
  static async getConfigElement() {
    return document.createElement("tradingview-widget-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:tradingview-widget-card",
      widget_type: "ticker-tape",
      title: "",
      pairs: ["OANDA:USDTRY", "OANDA:EURTRY", "BINANCE:BTCUSDTPERP", "BIST:XU100"],
      show_symbol_logo: true,
      display_mode: "regular",
      is_transparent: false,
      height: "50px",
      width: "100%",
      color_theme: "dark",
      locale: "en"
    };
  }
}
customElements.define("tradingview-widget-card", TradingViewWidgetCard);

// --- EDITOR COMPONENT ---

class TradingViewWidgetCardEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: {
        state: true
      }
    };
  }
  
  _stopEvent(ev) {
    ev.stopPropagation();
  }

  setConfig(config) {
    this._config = config;
  }
  
  _valueChanged(event, configKey) {
    if (!configKey) return;
    
    const target = event.currentTarget || event.target;
    let value = target.checked !== undefined ? target.checked : target.value;
    
    if (this._config[configKey] === value) {
      return;
    }
    
    let newConfig;
    if (configKey === "widget_type") {
      const defaultWidgetConfig = WIDGET_DEFAULTS_TEMP[value] || {};
      const baseEditorConfig = {
        color_theme: this._config.color_theme || "dark",
        locale: this._config.locale || "en",
        is_transparent: this._config.is_transparent !== undefined ? this._config.is_transparent : defaultWidgetConfig.is_transparent || false,
        title: this._config.title
      };
      const mergedConfig = {
        type: "custom:tradingview-widget-card",
        ...defaultWidgetConfig,
        ...baseEditorConfig
      };
      newConfig = mergedConfig;
    } else {
      const clonedConfig = {
        ...this._config
      };
      newConfig = clonedConfig;
      if (configKey === "pairs" || configKey === "currencies" || configKey === "country_filter") {
        if (!["market-overview", "stock-market-hotlists", "market-quotes"].includes(newConfig.widget_type)) {
          if (["single-quote", "technical-analysis"].includes(newConfig.widget_type) && configKey === "pairs") {
            value = value.trim() ? [value.trim()] : [];
          } else if (newConfig.widget_type === "economic-calendar" && configKey === "country_filter") {
            value = Array.isArray(value) ? value.map(val => val.trim()).filter(Boolean).join(",") : value;
          } else {
            value = value.split(",").map(val => val.trim()).filter(Boolean);
          }
          if (Array.isArray(value) && value.length === 0) {
            delete newConfig[configKey];
          } else {
            newConfig[configKey] = value;
          }
        }
      } else if (typeof value === "boolean") {
        newConfig[configKey] = value;
      } else if (value === "") {
        delete newConfig[configKey];
      } else {
        newConfig[configKey] = value;
      }
      if (configKey === "feed_mode") {
        if (newConfig.feed_mode !== "symbol") {
          delete newConfig.symbol;
        }
        if (newConfig.feed_mode !== "market") {
          delete newConfig.market;
        }
        if (newConfig.feed_mode === "market" && !newConfig.market) {
          newConfig.market = "crypto";
        }
      }
    }
    this._config = newConfig;
    this._dispatchConfigChanged(newConfig);
  }
  
  _dispatchConfigChanged(config) {
    const detailObj = {
      config: config
    };
    const eventOptions = {
      detail: detailObj,
      bubbles: true,
      composed: true
    };
    this.dispatchEvent(new CustomEvent("config-changed", eventOptions));
  }
  
  _addCurrency(event) {
    if (!event.target.value) {
      return;
    }
    const currency = event.target.value;
    const currentCurrencies = this._config.currencies || [];
    if (!currentCurrencies.includes(currency)) {
      const newConfig = {
        ...this._config,
        currencies: [...currentCurrencies, currency].sort()
      };
      this._config = newConfig;
      this._dispatchConfigChanged(newConfig);
    }
    event.target.value = null;
  }
  
  _removeCurrency(event) {
    const currencyToRemove = event.currentTarget.currency;
    const currentCurrencies = this._config.currencies || [];
    const newConfig = {
      ...this._config,
      currencies: currentCurrencies.filter(c => c !== currencyToRemove)
    };
    this._config = newConfig;
    this._dispatchConfigChanged(newConfig);
  }
  
  _addCountry(event) {
    if (event.target.value === null || event.target.value === undefined) {
      return;
    }
    const countryStr = event.target.value;
    let currentCountries = this._config.country_filter ? this._config.country_filter.split(",") : [];
    let newCountries = [...currentCountries];
    if (countryStr.includes(",")) {
      const countriesToAdd = countryStr.split(",");
      countriesToAdd.forEach(c => {
        if (!newCountries.includes(c)) {
          newCountries.push(c);
        }
      });
    } else if (!newCountries.includes(countryStr)) {
      newCountries.push(countryStr);
    }
    newCountries.sort();
    const newConfig = {
      ...this._config,
      country_filter: newCountries.join(",")
    };
    this._config = newConfig;
    this._dispatchConfigChanged(newConfig);
    event.target.value = null;
  }
  
  _removeCountry(event) {
    const countryToRemove = event.currentTarget.country;
    let currentCountries = this._config.country_filter ? this._config.country_filter.split(",") : [];
    let filteredCountries = currentCountries.filter(c => c !== countryToRemove);
    const newConfig = {
      ...this._config,
      country_filter: filteredCountries.join(",") === "" ? undefined : filteredCountries.join(",")
    };
    this._config = newConfig;
    this._dispatchConfigChanged(newConfig);
  }
  
  render() {
    if (!this.hass) {
      return html``;
    }
    const config = this._config || {};
    const widgetType = config.widget_type || "ticker-tape";
    return html`
      <div class="card-config">
        <ha-textfield
          label="Title (Optional)"
          .value=${config.title || ""}
          @input=${(ev) => this._valueChanged(ev, "title")}
        ></ha-textfield>

        <ha-select
          label="Widget Type"
          .value=${widgetType}
          @selected=${(ev) => this._valueChanged(ev, "widget_type")}
          @closed=${this._stopEvent}
          fixedMenuPosition
          naturalMenuWidth
        >
          ${Object.keys(WIDGET_CONFIGS).map(wt => html`
            <mwc-list-item .value=${wt}>
              ${wt.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase())}
            </mwc-list-item>
          `)}
        </ha-select>

        ${this._renderDynamicOptions(widgetType, config)}

        <div class="grid">
            <ha-select
              label="Color Theme"
              .value=${config.color_theme || "dark"}
              @selected=${(ev) => this._valueChanged(ev, "color_theme")}
              @closed=${this._stopEvent}
              fixedMenuPosition
            >
              <mwc-list-item value="dark">Dark</mwc-list-item>
              <mwc-list-item value="light">Light</mwc-list-item>
            </ha-select>
            <ha-select
              label="Language"
              .value=${config.locale || "en"}
              @selected=${(ev) => this._valueChanged(ev, "locale")}
              @closed=${this._stopEvent}
              fixedMenuWidth
              fixedMenuPosition
            >
              <mwc-list-item value="en">English</mwc-list-item><mwc-list-item value="tr">Türkçe</mwc-list-item><mwc-list-item value="de">Deutsch</mwc-list-item><mwc-list-item value="fr">Français</mwc-list-item><mwc-list-item value="in">English (India)</mwc-list-item><mwc-list-item value="ca_ES">Català</mwc-list-item><mwc-list-item value="es">Español</mwc-list-item><mwc-list-item value="it">Italiano</mwc-list-item><mwc-list-item value="pl">Polski</mwc-list-item><mwc-list-item value="hu_HU">Magyar</mwc-list-item><mwc-list-item value="sv_SE">Svenska</mwc-list-item><mwc-list-item value="ru">Русский</mwc-list-item><mwc-list-item value="br">Português</mwc-list-item><mwc-list-item value="id">Bahasa Indonesia</mwc-list-item><mwc-list-item value="ms_MY">Bahasa Melayu</mwc-list-item><mwc-list-item value="th_TH">ภาษาไทย</mwc-list-item><mwc-list-item value="vi_VN">Tiếng Việt</mwc-list-item><mwc-list-item value="ja">日本語</mwc-list-item><mwc-list-item value="kr">한국어</mwc-list-item><mwc-list-item value="zh_CN">简体中文</mwc-list-item><mwc-list-item value="zh_TW">繁體中文</mwc-list-item><mwc-list-item value="ar_AE">العربية</mwc-list-item><mwc-list-item value="he_IL">עברית</mwc-list-item>
            </ha-select>
        </div>

        <div class="grid">
            <ha-textfield
              label="Height (e.g. 50px, 100%)"
              .value=${config.height || ""}
              @input=${(ev) => this._valueChanged(ev, "height")}
              placeholder="Default (widget specific)"
            ></ha-textfield>
            <ha-textfield
              label="Width (e.g. 500px, 100%)"
              .value=${config.width || ""}
              @input=${(ev) => this._valueChanged(ev, "width")}
              placeholder="Default (100%)"
            ></ha-textfield>
        </div>

        ${widgetType !== "forex-cross-rates" ? html`
            <div class="inline-switch">
                <ha-formfield .label=${"Transparent Background"}>
                  <ha-switch
                    .checked=${config.is_transparent || false}
                    @change=${(ev) => this._valueChanged(ev, "is_transparent")}
                  ></ha-switch>
                </ha-formfield>
              ${["ticker-tape", "tickers", "market-quotes"].includes(config.widget_type) ? html`
                <ha-formfield .label=${"Show Symbol Logo"}>
                  <ha-switch
                    .checked=${config.show_symbol_logo !== false}
                    @change=${(ev) => this._valueChanged(ev, "show_symbol_logo")}
                  ></ha-switch>
                </ha-formfield>
              ` : ""}
            </div>
        ` : ""}
      </div>
    `;
  }
  
  _renderDynamicOptions(widgetType, config) {
    if (!widgetType) {
      return html``;
    }
    
    const renderTextField = (label, helperText, val, configVal) => html`
      <ha-textfield
        label=${label}
        .value=${val}
        helper=${helperText}
        @input=${(ev) => this._valueChanged(ev, configVal)}
      ></ha-textfield>`;
      
    const renderSwitch = (label, checked, configVal) => html`
      <ha-formfield .label=${label}>
        <ha-switch
          .checked=${checked}
          @change=${(ev) => this._valueChanged(ev, configVal)}
        ></ha-switch>
      </ha-formfield>`;

    if (widgetType === "market-overview" || widgetType === "market-quotes") {
      return html`
            <div class="textarea-container">
                <label>Tabs & Symbols Configuration</label>
                <textarea
                    class="native-textarea"
                    .value=${config.tab_config || ""}
                    @input=${(ev) => this._valueChanged(ev, "tab_config")}
                    rows="10"
                ></textarea>
                <div class="helper-text">Format: "TabName:" new line "- Symbol"</div>
            </div>
            
            ${widgetType === "market-overview" ? html`
            <div class="grid">
                <ha-select label="Date Range" .value=${config.date_range || "12M"} @selected=${(ev) => this._valueChanged(ev, "date_range")} @closed=${this._stopEvent} fixedMenuPosition>
                    <mwc-list-item value="1D">1 Day</mwc-list-item>
                    <mwc-list-item value="1M">1 Month</mwc-list-item>
                    <mwc-list-item value="3M">3 Months</mwc-list-item>
                    <mwc-list-item value="12M">1 Year</mwc-list-item>
                    <mwc-list-item value="60M">5 Years</mwc-list-item>
                    <mwc-list-item value="ALL">All</mwc-list-item>
                </ha-select>
            </div>

            <div class="switch-container">
                ${renderSwitch("Show Chart", config.show_chart !== false, "show_chart")}
                ${renderSwitch("Floating Tooltip", config.show_floating_tooltip !== false, "show_floating_tooltip")}
            </div>
            ` : ""}
        `;
    }
    if (widgetType === "stock-market-hotlists") {
      return html`
        <ha-select label="Exchange" .value=${config.exchange || "US Exchanges"} @selected=${(ev) => this._valueChanged(ev, "exchange")} @closed=${this._stopEvent} fixedMenuPosition>
            ${HOTLIST_EXCHANGES.map(ex => html`<mwc-list-item value="${ex.v}">${ex.l}</mwc-list-item>`)}
        </ha-select>
        
        <div class="grid">
            <ha-select label="Date Range" .value=${config.date_range || "12M"} @selected=${(ev) => this._valueChanged(ev, "date_range")} @closed=${this._stopEvent} fixedMenuPosition>
                <mwc-list-item value="1D">1 Day</mwc-list-item>
                <mwc-list-item value="1M">1 Month</mwc-list-item>
                <mwc-list-item value="3M">3 Months</mwc-list-item>
                <mwc-list-item value="12M">1 Year</mwc-list-item>
                <mwc-list-item value="60M">5 Years</mwc-list-item>
                <mwc-list-item value="ALL">All</mwc-list-item>
            </ha-select>
        </div>

        <div class="switch-container">
            ${renderSwitch("Show Chart", config.show_chart !== false, "show_chart")}
            ${renderSwitch("Floating Tooltip", config.show_floating_tooltip !== false, "show_floating_tooltip")}
        </div>
      `;
    }
    
    const ETF_SOURCES = [
      { id: "AllAUEtf", label: "Australia" }, { id: "AllCAEtf", label: "Canada" }, { id: "AllFREtf", label: "France" },
      { id: "AllDEEtf", label: "Germany" }, { id: "AllHKEtf", label: "Hong Kong, China" }, { id: "AllINEtf", label: "India" },
      { id: "AllILEtf", label: "Israel" }, { id: "AllITEtf", label: "Italy" }, { id: "AllJPEtf", label: "Japan" },
      { id: "AllLUEtf", label: "Luxembourg" }, { id: "AllMYEtf", label: "Malaysia" }, { id: "AllNLEtf", label: "Netherlands" },
      { id: "AllNZEtf", label: "New Zealand" }, { id: "AllROEtf", label: "Romania" }, { id: "AllSGPEtf", label: "Singapore" },
      { id: "AllESEtf", label: "Spain" }, { id: "AllCHEEtf", label: "Switzerland" }, { id: "AllTWEtf", label: "Taiwan, China" },
      { id: "AllTHEtf", label: "Thailand" }, { id: "AllTREtf", label: "Turkey" }, { id: "AllAREEtf", label: "UAE" },
      { id: "AllUKEtf", label: "UK" }, { id: "AllUSEtf", label: "USA" }, { id: "AllVNEtf", label: "Vietnam" }
    ];
    
    switch (widgetType) {
      case "ticker-tape":
      case "tickers":
        return html`
          ${renderTextField("Symbols (comma-separated)", "e.g: BINANCE:BTCUSDT,BIST:XU100", (config.pairs || []).join(","), "pairs")}
          ${widgetType === "ticker-tape" ? html`
            <ha-select label="Display Mode" .value=${config.display_mode || "regular"} @selected=${(ev) => this._valueChanged(ev, "display_mode")} @closed=${this._stopEvent} fixedMenuPosition>
              <mwc-list-item value="regular">Regular</mwc-list-item>
              <mwc-list-item value="adaptive">Adaptive</mwc-list-item>
              <mwc-list-item value="compact">Compact</mwc-list-item>
            </ha-select>
          ` : ""}
        `;
      case "single-quote":
      case "technical-analysis":
        const taOptions = widgetType === "technical-analysis" ? html`
          <div class="grid">
            <ha-select label="Time Interval" .value=${config.interval || "1D"} @selected=${(ev) => this._valueChanged(ev, "interval")} @closed=${this._stopEvent} fixedMenuPosition>
              ${["1m", "5m", "15m", "1H", "4H", "1D", "1W", "1M"].map(interval => html`<mwc-list-item .value=${interval}>${interval}</mwc-list-item>`)}
            </ha-select>
            ${renderSwitch("Show Interval Tabs", config.show_interval_tabs !== false, "show_interval_tabs")}
          </div>
          <ha-select label="Display Mode" .value=${config.display_mode || "single"} @selected=${(ev) => this._valueChanged(ev, "display_mode")} @closed=${this._stopEvent} fixedMenuPosition>
            <mwc-list-item value="single">Single</mwc-list-item>
            <mwc-list-item value="multiple">Multiple</mwc-list-item>
          </ha-select>
        ` : "";
        return html`${renderTextField("Symbol", "Just one symbol. e.g: NASDAQ:AAPL", (config.pairs || [""])[0], "pairs")}${taOptions}`;
      case "stock-heatmap":
      case "etf-heatmap":
        const isStockHeatmap = widgetType === "stock-heatmap";
        const SIZES = isStockHeatmap ? [
          { v: "market_cap_basic", n: "Market cap" }, { v: "volume", n: "Volume 1D" }, { v: "volume|1W", n: "Volume 1W" },
          { v: "volume|1M", n: "Volume 1M" }, { v: "Value.Traded", n: "Price * Volume (Turnover) 1D" },
          { v: "Value.Traded|1W", n: "Price * Volume (Turnover) 1W" }, { v: "Value.Traded|1M", n: "Price * Volume (Turnover) 1M" }, { v: "monoSize", n: "Mono size" }
        ] : [
          { v: "volume", n: "Volume 1D" }, { v: "volume|1W", n: "Volume 1W" }, { v: "volume|1M", n: "Volume 1M" },
          { v: "Value.Traded", n: "Price * Volume (Turnover) 1D" }, { v: "Value.Traded|1W", n: "Price * Volume (Turnover) 1W" },
          { v: "Value.Traded|1M", n: "Price * Volume (Turnover) 1M" }, { v: "monoSize", n: "Mono size" }
        ];
        const ASSET_CLASSES = ["asset_class", "no_group"];
        const HEATMAP_COLORS = [
          { value: "change|60", label: "Change 1h, %" }, { value: "change|240", label: "Change 4h, %" }, { value: "change", label: "Change D" },
          { value: "Perf.W", label: "Performance W" }, { value: "Perf.1M", label: "Performance M" }, { value: "Perf.3M", label: "Performance 3M, %" },
          { value: "Perf.6M", label: "Performance 6M, %" }, { value: "Perf.Y", label: "Performance Y, %" }, { value: "Perf.YTD", label: "Year-to-Date" },
          { value: "premarket_change", label: "Pre-market Change, %" }, { value: "postmarket_change", label: "Post-market Change, %" },
          { value: "relative_volume_10d_calc", label: "Relative Volume" }, { value: "Volatility.D", label: "Volatility D, %" }, { value: "gap", label: "Gap, %" }
        ];
        const ETF_COLORS = [
          { value: "change", label: "Change D, %" }, { value: "Perf.W", label: "Performance W, %" }, { value: "Perf.1M", label: "Performance M, %" },
          { value: "Perf.3M", label: "Performance 3M, %" }, { value: "Perf.6M", label: "Performance 6M, %" }, { value: "Perf.YTD", label: "Performance YTD, %" },
          { value: "Perf.Y", label: "Performance Y, %" }, { value: "nav_total_return.1M", label: "NAV total return M" }, { value: "nav_total_return.3M", label: "NAV total return 3M" },
          { value: "nav_total_return.YTD", label: "NAV total return YTD" }, { value: "nav_total_return.1Y", label: "NAV total return Y" },
          { value: "nav_total_return.3Y", label: "NAV total return 3Y" }, { value: "weight_top_10", label: "Top 10 weight (% in top)" },
          { value: "weight_top_25", label: "Top 25 weight (% in top)" }, { value: "Volatility.D", label: "Volatility D, %" }, { value: "Volatility.M", label: "Volatility M, %" },
          { value: "beta_1_year", label: "Beta 1Y" }, { value: "beta_3_year", label: "Beta 3Y" }, { value: "beta_5_year", label: "Beta 5Y" }
        ];
        return html`
          ${isStockHeatmap ? renderTextField("Data Source", "e.g: SPX500", config.data_source || "", "data_source") : html`<ha-select label="Data Source" .value=${config.data_source || ""} @selected=${(ev) => this._valueChanged(ev, "data_source")} @closed=${this._stopEvent} fixedMenuPosition>${ETF_SOURCES.map(src => html`<mwc-list-item value="${src.id}">${src.label}</mwc-list-item>`)}</ha-select>`}
          ${isStockHeatmap ? renderTextField("Exchange (Optional)", "e.g: NASDAQ", config.exchange || "", "exchange") : ""}
          <div class="grid">
            <ha-select label="Grouping" .value=${config.grouping || (isStockHeatmap ? "sector" : "asset_class")} @selected=${(ev) => this._valueChanged(ev, "grouping")} @closed=${this._stopEvent} fixedMenuPosition}>
              ${(isStockHeatmap ? ["sector", "no_group"] : ASSET_CLASSES).map(group => html`<mwc-list-item .value=${group}>${group.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</mwc-list-item>`)}
            </ha-select>
            <ha-select label="Block Color" .value=${config.block_color || "change"} @selected=${(ev) => this._valueChanged(ev, "block_color")} @closed=${this._stopEvent} fixedMenuPosition}>
              ${isStockHeatmap ? HEATMAP_COLORS.map(color => html`<mwc-list-item value="${color.value}">${color.label}</mwc-list-item>`) : ETF_COLORS.map(color => html`<mwc-list-item value="${color.value}">${color.label}</mwc-list-item>`)}
            </ha-select>
          </div>
          <ha-select label="Block Size" .value=${config.block_size || (isStockHeatmap ? "market_cap_basic" : "volume")} @selected=${(ev) => this._valueChanged(ev, "block_size")} @closed=${this._stopEvent} fixedMenuPosition}>
            ${SIZES.map(sz => html`<mwc-list-item .value=${sz.v}>${sz.n}</mwc-list-item>`)}
          </ha-select>
          
          <div class="switch-container">
            ${renderSwitch("Show Top Bar", config.has_top_bar || false, "has_top_bar")}
            ${renderSwitch("Zoom Enabled", config.is_zoom_enabled !== false, "is_zoom_enabled")}
            ${renderSwitch("Has Symbol Tooltip", config.has_symbol_tooltip !== false, "has_symbol_tooltip")}
            ${renderSwitch("Data Set Enabled", config.is_data_set_enabled || false, "is_data_set_enabled")}
            ${renderSwitch("Mono Size", config.is_mono_size || false, "is_mono_size")}
          </div>
        `;
      case "forex-heat-map":
      case "forex-cross-rates":
        const selectedCurrencies = config.currencies || [];
        const availableCurrencies = FOREX_CURRENCIES.filter(c => !selectedCurrencies.includes(c));
        return html`
          <div class="currency-selector">
            <label id="currency-label">Currencies</label>
            <div class="tags-container" aria-labelledby="currency-label">
              ${selectedCurrencies.map(cur => html`
                <span class="tag">
                  ${cur}
                  <button class="remove-btn" .currency=${cur} @click=${this._removeCurrency} title="Remove ${cur}">x</button>
                </span>
              `)}
            </div>
            <ha-select
                label="Add Currency"
                @selected=${this._addCurrency}
                @closed=${this._stopEvent}
                fixedMenuPosition
            >
              ${availableCurrencies.map(cur => html`
                <mwc-list-item .value=${cur}>${cur}</mwc-list-item>
              `)}
            </ha-select>
          </div>
          ${renderTextField("Background Color (Hex)", "e.g: #0F0F0F", config.background_color || "", "background_color")}
        `;
      case "economic-calendar":
        const selectedCountries = config.country_filter ? config.country_filter.split(",") : [];
        const selectedCountryObjs = selectedCountries.map(c => COUNTRIES_FOR_ECONOMIC_CALENDAR.find(co => co.code === c)).filter(Boolean);
        const availableCountries = COUNTRIES_FOR_ECONOMIC_CALENDAR.filter(co => {
          if (co.code.includes(",")) {
            const subCountries = co.code.split(",");
            return !subCountries.every(sc => selectedCountries.includes(sc));
          }
          return !selectedCountries.includes(co.code);
        });
        return html`
          <div class="country-selector">
              <label id="country-label">Country Filter</label>
              <div class="tags-container" aria-labelledby="country-label">
                  ${selectedCountryObjs.map(co => html`
                      <span class="tag">
                          ${co.name}
                          <button class="remove-btn" .country=${co.code} @click=${this._removeCountry} title="Remove ${co.name}">x</button>
                      </span>
                  `)}
              </div>
              <ha-select
                  label="Add Country"
                  @selected=${this._addCountry}
                  @closed=${this._stopEvent}
                  fixedMenuPosition
              >
                  ${availableCountries.map(co => html`
                      <mwc-list-item .value=${co.code}>${co.name}</mwc-list-item>
                  `)}
              </ha-select>
          </div>
          <ha-select
              label="Importance Filter"
              .value=${config.importance_filter || "-1,0,1"}
              @selected=${(ev) => this._valueChanged(ev, "importance_filter")}
              @closed=${this._stopEvent}
              fixedMenuPosition
          >
              <mwc-list-item value="-1,0,1">All (No Filter)</mwc-list-item>
              <mwc-list-item value="1">Low</mwc-list-item>
              <mwc-list-item value="0">Medium</mwc-list-item>
              <mwc-list-item value="-1">High</mwc-list-item>
              <mwc-list-item value="-1,0">High & Medium</mwc-list-item>
              <mwc-list-item value="0,1">Medium & Low</mwc-list-item>
          </ha-select>
        `;
      case "news":
        const MARKETS = [
          { id: "crypto", label: "Cryptocurrencies" }, { id: "forex", label: "Currencies" }, { id: "stock", label: "Stocks" },
          { id: "index", label: "Indices" }, { id: "futures", label: "Futures" }, { id: "cfd", label: "Bonds" }
        ];
        return html`
          <ha-select label="Display Mode" .value=${config.display_mode || "adaptive"} @selected=${(ev) => this._valueChanged(ev, "display_mode")} @closed=${this._stopEvent} fixedMenuPosition>
            <mwc-list-item value="adaptive">Adaptive</mwc-list-item>
            <mwc-list-item value="regular">Regular</mwc-list-item>
            <mwc-list-item value="compact">Compact</mwc-list-item>
          </ha-select>
          <ha-select label="Feed Mode" .value=${config.feed_mode || "all_symbols"} @selected=${(ev) => this._valueChanged(ev, "feed_mode")} @closed=${this._stopEvent} fixedMenuPosition>
            <mwc-list-item value="all_symbols">All Symbols</mwc-list-item>
            <mwc-list-item value="symbol">Symbol</mwc-list-item>
            <mwc-list-item value="market">Market</mwc-list-item>
          </ha-select>
          ${config.feed_mode === "symbol" ? html`
            <ha-textfield
              label="Symbol"
              .value=${config.symbol || ""}
              @input=${(ev) => this._valueChanged(ev, "symbol")}
            ></ha-textfield>
          ` : ""}
          ${config.feed_mode === "market" ? html`
            <ha-select
              label="Market Type"
              .value=${config.market || "crypto"}
              @selected=${(ev) => this._valueChanged(ev, "market")}
              @closed=${this._stopEvent}
              fixedMenuPosition
            >
              ${MARKETS.map(m => html`<mwc-list-item value=${m.id}>${m.label}</mwc-list-item>`)}
            </ha-select>
          ` : ""}
        `;
      default:
        return html``;
    }
  }
  static get styles() {
    return css`
      .card-config { display: flex; flex-direction: column; gap: 16px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .inline-switch { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 16px; }
      .switch-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; align-items: start; }
      .switch-container ha-formfield { padding-top: 0; }
      .textarea-container { display: flex; flex-direction: column; gap: 4px; }
      .native-textarea {
        width: 100%;
        min-height: 150px;
        padding: 8px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        border-radius: 4px;
        font-family: monospace;
        box-sizing: border-box;
      }
      .native-textarea:focus {
        border-color: var(--primary-color);
        outline: none;
      }
      .helper-text { font-size: 11px; color: var(--secondary-text-color); margin-bottom: 4px; }
      ha-select, ha-textfield, ha-textarea { width: 100%; }
      ha-formfield { display: flex; align-items: center; justify-content: space-between; }
      .currency-selector, .country-selector { display: flex; flex-direction: column; gap: 8px; }
      .currency-selector > label, .country-selector > label {
        font-family: var(--paper-font-body1_-_font-family);
        -webkit-font-smoothing: var(--paper-font-body1_-_-webkit-font-smoothing);
        font-size: 12px;
        font-weight: 500;
        color: var(--input-label-ink-color, var(--primary-text-color));
        padding: 0;
      }
      .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 4px 0;
        min-height: 24px;
      }
      .tag {
        position: relative;
        display: inline-flex;
        align-items: center;
        background-color: #005912;
        color: var(--text-primary-color);
        border-radius: 12px;
        padding: 2px 10px;
        font-weight: 500;
        margin: 2px;
      }
      .tag .remove-btn {
        position: absolute;
        top: -3px;
        right: -3px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: white;
        color: black;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        padding: 0;
        line-height: 1;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        transition: background-color 0.2s ease;
        z-index: 1;
      }
      .tag .remove-btn:hover {
        background-color: var(--error-color-dark, #d32f2f);
      }
    `;
  }
}
customElements.define("tradingview-widget-card-editor", TradingViewWidgetCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "tradingview-widget-card",
  name: "TradingView Widget Card",
  preview: true,
  description: "A versatile card that displays various financial widgets from TradingView."
});
