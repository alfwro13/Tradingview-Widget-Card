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
      _config: { state: true }
    };
  }

  setConfig(config) {
    this._config = config;
  }

  // ✅ FIXED VALUE HANDLER
  _valueChanged(event, configKey) {
    if (!configKey) return;

    let value;

    // ✅ Correct handling for ha-select
    if (event.detail && event.detail.value !== undefined) {
      value = event.detail.value;
    } else {
      const target = event.currentTarget || event.target;
      value = target.checked !== undefined ? target.checked : target.value;
    }

    if (this._config[configKey] === value) return;

    let newConfig;

    if (configKey === "widget_type") {
      const defaultWidgetConfig = WIDGET_DEFAULTS_TEMP[value] || {};
      const baseEditorConfig = {
        color_theme: this._config.color_theme || "dark",
        locale: this._config.locale || "en",
        is_transparent:
          this._config.is_transparent !== undefined
            ? this._config.is_transparent
            : defaultWidgetConfig.is_transparent || false,
        title: this._config.title
      };

      newConfig = {
        type: "custom:tradingview-widget-card",
        ...defaultWidgetConfig,
        ...baseEditorConfig
      };
    } else {
      newConfig = { ...this._config };

      if (
        ["pairs", "currencies", "country_filter"].includes(configKey)
      ) {
        if (
          !["market-overview", "stock-market-hotlists", "market-quotes"].includes(
            newConfig.widget_type
          )
        ) {
          if (
            ["single-quote", "technical-analysis"].includes(
              newConfig.widget_type
            ) &&
            configKey === "pairs"
          ) {
            value = value.trim() ? [value.trim()] : [];
          } else if (
            newConfig.widget_type === "economic-calendar" &&
            configKey === "country_filter"
          ) {
            value = Array.isArray(value)
              ? value.map((v) => v.trim()).filter(Boolean).join(",")
              : value;
          } else {
            value = value.split(",").map((v) => v.trim()).filter(Boolean);
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
        if (newConfig.feed_mode !== "symbol") delete newConfig.symbol;
        if (newConfig.feed_mode !== "market") delete newConfig.market;
        if (newConfig.feed_mode === "market" && !newConfig.market) {
          newConfig.market = "crypto";
        }
      }
    }

    this._config = newConfig;
    this._dispatchConfigChanged(newConfig);
  }

  _dispatchConfigChanged(config) {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    if (!this.hass) return html``;

    const config = this._config || {};
    const widgetType = config.widget_type || "ticker-tape";

    return html`
      <div class="card-config">
        <ha-textfield
          label="Title"
          .value=${config.title || ""}
          @input=${(e) => this._valueChanged(e, "title")}
        ></ha-textfield>

        <!-- ✅ FIXED SELECT -->
        <ha-select
          label="Widget Type"
          .value=${widgetType}
          @selected=${(e) => this._valueChanged(e, "widget_type")}
        >
          ${Object.keys(WIDGET_CONFIGS).map(
            (wt) => html`
              <mwc-list-item value="${wt}">
                ${wt.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </mwc-list-item>
            `
          )}
        </ha-select>

        <!-- THEME -->
        <ha-select
          label="Color Theme"
          .value=${config.color_theme || "dark"}
          @selected=${(e) => this._valueChanged(e, "color_theme")}
        >
          <mwc-list-item value="dark">Dark</mwc-list-item>
          <mwc-list-item value="light">Light</mwc-list-item>
        </ha-select>

        <!-- LANGUAGE -->
        <ha-select
          label="Language"
          .value=${config.locale || "en"}
          @selected=${(e) => this._valueChanged(e, "locale")}
        >
          <mwc-list-item value="en">English</mwc-list-item>
          <mwc-list-item value="de">Deutsch</mwc-list-item>
          <mwc-list-item value="fr">Français</mwc-list-item>
        </ha-select>

        <ha-textfield
          label="Height"
          .value=${config.height || ""}
          @input=${(e) => this._valueChanged(e, "height")}
        ></ha-textfield>

        <ha-textfield
          label="Width"
          .value=${config.width || ""}
          @input=${(e) => this._valueChanged(e, "width")}
        ></ha-textfield>

        <ha-formfield label="Transparent">
          <ha-switch
            .checked=${config.is_transparent || false}
            @change=${(e) => this._valueChanged(e, "is_transparent")}
          ></ha-switch>
        </ha-formfield>
      </div>
    `;
  }

  static get styles() {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `;
  }
}

customElements.define(
  "tradingview-widget-card-editor",
  TradingViewWidgetCardEditor
);
