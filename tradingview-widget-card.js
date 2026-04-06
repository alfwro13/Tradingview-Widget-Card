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
const WIDGET_CONFIGS = {
  "ticker-tape": {
    baseUrl: "https://s.tradingview.com/embed-widget/ticker-tape/"
  },
  tickers: {
    baseUrl: "https://www.tradingview-widget.com/embed-widget/tickers/"
  },
  "single-quote": {
    baseUrl: "https://www.tradingview-widget.com/embed-widget/single-quote/"
  },
  "stock-heatmap": {
    baseUrl: "https://www.tradingview-widget.com/embed-widget/stock-heatmap/"
  },
  "etf-heatmap": {
    baseUrl: "https://www.tradingview-widget.com/embed-widget/etf-heatmap/"
  },
  "forex-heat-map": {
    baseUrl: "https://www.tradingview-widget.com/embed-widget/forex-heat-map/"
  },
  "forex-cross-rates": {
    baseUrl: "https://www.tradingview-widget.com/embed-widget/forex-cross-rates/"
  },
  "technical-analysis": {
    baseUrl: "https://www.tradingview-widget.com/embed-widget/technical-analysis/"
  },
  "economic-calendar": {
    baseUrl: "https://www.tradingview-widget.com/embed-widget/events/"
  },
  news: {
    baseUrl: "https://www.tradingview-widget.com/embed-widget/timeline/"
  },
  "market-overview": {
    baseUrl: "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
  },
  "stock-market-hotlists": {
    baseUrl: "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js"
  },
  "market-quotes": {
    baseUrl: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
  }
};
const HOTLIST_EXCHANGES = [{
  l: "USA (US Exchanges)",
  v: "US Exchanges"
}, {
  l: "USA (NASDAQ)",
  v: "NASDAQ"
}, {
  l: "USA (NYSE)",
  v: "NYSE"
}, {
  l: "USA (NYSE ARCA)",
  v: "NYSE ARCA"
}, {
  l: "USA (OTC)",
  v: "OTC"
}, {
  l: "Turkey (BIST)",
  v: "BIST"
}, {
  l: "Argentina (BYMA)",
  v: "BYMA"
}, {
  l: "Australia (ASX)",
  v: "ASX"
}, {
  l: "Austria (VIE)",
  v: "VIE"
}, {
  l: "Brazil (BMFBOVESPA)",
  v: "BMFBOVESPA"
}, {
  l: "Canada (CSE)",
  v: "CSE"
}, {
  l: "Canada (NEO)",
  v: "NEO"
}, {
  l: "Canada (TSX)",
  v: "TSX"
}, {
  l: "Canada (TSXV)",
  v: "TSXV"
}, {
  l: "Chile (BCS)",
  v: "BCS"
}, {
  l: "Colombia (BVC)",
  v: "BVC"
}, {
  l: "Cyprus (CSECY)",
  v: "CSECY"
}, {
  l: "Czech Republic (PSECZ)",
  v: "PSECZ"
}, {
  l: "Denmark (OMXCOP)",
  v: "OMXCOP"
}, {
  l: "Egypt (EGX)",
  v: "EGX"
}, {
  l: "Estonia (OMXTSE)",
  v: "OMXTSE"
}, {
  l: "Finland (OMXHEX)",
  v: "OMXHEX"
}, {
  l: "Germany (BER)",
  v: "BER"
}, {
  l: "Germany (DUS)",
  v: "DUS"
}, {
  l: "Germany (FWB)",
  v: "FWB"
}, {
  l: "Germany (HAM)",
  v: "HAM"
}, {
  l: "Germany (HAN)",
  v: "HAN"
}, {
  l: "Germany (LS)",
  v: "LS"
}, {
  l: "Germany (LSX)",
  v: "LSX"
}, {
  l: "Germany (MUN)",
  v: "MUN"
}, {
  l: "Germany (SWB)",
  v: "SWB"
}, {
  l: "Germany (TRADEGATE)",
  v: "TRADEGATE"
}, {
  l: "Germany (XETR)",
  v: "XETR"
}, {
  l: "Greece (ATHEX)",
  v: "ATHEX"
}, {
  l: "Hungary (BET)",
  v: "BET"
}, {
  l: "Iceland (OMXICE)",
  v: "OMXICE"
}, {
  l: "India (BSE)",
  v: "BSE"
}, {
  l: "Indonesia (IDX)",
  v: "IDX"
}, {
  l: "Israel (TASE)",
  v: "TASE"
}, {
  l: "Italy (EUROTLX)",
  v: "EUROTLX"
}, {
  l: "Italy (MIL)",
  v: "MIL"
}, {
  l: "Kuwait (KSE)",
  v: "KSE"
}, {
  l: "Latvia (OMXRSE)",
  v: "OMXRSE"
}, {
  l: "Lithuania (OMXVSE)",
  v: "OMXVSE"
}, {
  l: "Mainland China (SSE)",
  v: "SSE"
}, {
  l: "Mexico (BIVA)",
  v: "BIVA"
}, {
  l: "Morocco (CSEMA)",
  v: "CSEMA"
}, {
  l: "Poland (GPW)",
  v: "GPW"
}, {
  l: "Poland (NEWCONNECT)",
  v: "NEWCONNECT"
}, {
  l: "Russia (RUS)",
  v: "RUS"
}, {
  l: "South Korea (KRX)",
  v: "KRX"
}, {
  l: "Spain (BME)",
  v: "BME"
}, {
  l: "Sri Lanka (CSELK)",
  v: "CSELK"
}, {
  l: "Sweden (OMXSTO)",
  v: "OMXSTO"
}, {
  l: "Switzerland (BX)",
  v: "BX"
}, {
  l: "Switzerland (SIX)",
  v: "SIX"
}, {
  l: "Taiwan, China (TPEX)",
  v: "TPEX"
}, {
  l: "UAE (ADX)",
  v: "ADX"
}, {
  l: "United Kingdom (AQUIS)",
  v: "AQUIS"
}, {
  l: "Venezuela (BVCV)",
  v: "BVCV"
}, {
  l: "Vietnam (HNX)",
  v: "HNX"
}, {
  l: "Vietnam (UPCOM)",
  v: "UPCOM"
}];
const FOREX_CURRENCIES = ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD", "CNY", "TRY", "NOK", "SEK", "DKK", "ZAR", "HKD", "SGD", "MXN", "THB", "IDR", "KRW", "PLN", "ISK", "AED", "KWD", "RUB", "ILS", "ARS", "COP", "CLP", "PEN", "UYU"];
const COUNTRIES_FOR_ECONOMIC_CALENDAR = [{
  name: "Top 20 Economies",
  code: "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu"
}, {
  name: "USA",
  code: "us"
}, {
  name: "Canada",
  code: "ca"
}, {
  name: "Austria",
  code: "at"
}, {
  name: "Belgium",
  code: "be"
}, {
  name: "Cyprus",
  code: "cy"
}, {
  name: "Czech Republic",
  code: "cz"
}, {
  name: "Denmark",
  code: "dk"
}, {
  name: "Estonia",
  code: "ee"
}, {
  name: "European Union",
  code: "eu"
}, {
  name: "Finland",
  code: "fi"
}, {
  name: "France",
  code: "fr"
}, {
  name: "Germany",
  code: "de"
}, {
  name: "Greece",
  code: "gr"
}, {
  name: "Hungary",
  code: "hu"
}, {
  name: "Iceland",
  code: "is"
}, {
  name: "Ireland",
  code: "ie"
}, {
  name: "Italy",
  code: "it"
}, {
  name: "Latvia",
  code: "lv"
}, {
  name: "Lithuania",
  code: "lt"
}, {
  name: "Luxembourg",
  code: "lu"
}, {
  name: "Netherlands",
  code: "nl"
}, {
  name: "Norway",
  code: "no"
}, {
  name: "Poland",
  code: "pl"
}, {
  name: "Portugal",
  code: "pt"
}, {
  name: "Romania",
  code: "ro"
}, {
  name: "Russia",
  code: "ru"
}, {
  name: "Serbia",
  code: "rs"
}, {
  name: "Slovakia",
  code: "sk"
}, {
  name: "Spain",
  code: "es"
}, {
  name: "Sweden",
  code: "se"
}, {
  name: "Switzerland",
  code: "ch"
}, {
  name: "Ukraine",
  code: "ua"
}, {
  name: "United Kingdom",
  code: "gb"
}, {
  name: "Angola",
  code: "ao"
}, {
  name: "Bahrain",
  code: "bh"
}, {
  name: "Botswana",
  code: "bw"
}, {
  name: "Egypt",
  code: "eg"
}, {
  name: "Ethiopia",
  code: "et"
}, {
  name: "Ghana",
  code: "gh"
}, {
  name: "Israel",
  code: "il"
}, {
  name: "Kenya",
  code: "ke"
}, {
  name: "Kuwait",
  code: "kw"
}, {
  name: "Malawi",
  code: "mw"
}, {
  name: "Mauritius",
  code: "mu"
}, {
  name: "Morocco",
  code: "ma"
}, {
  name: "Mozambique",
  code: "mz"
}, {
  name: "Namibia",
  code: "na"
}, {
  name: "Nigeria",
  code: "ng"
}, {
  name: "Oman",
  code: "om"
}, {
  name: "Qatar",
  code: "qa"
}, {
  name: "Rwanda",
  code: "rw"
}, {
  name: "Saudi Arabia",
  code: "sa"
}, {
  name: "Seychelles",
  code: "sc"
}, {
  name: "South Africa",
  code: "za"
}, {
  name: "Tanzania",
  code: "tz"
}, {
  name: "Tunisia",
  code: "tn"
}, {
  name: "Turkey",
  code: "tr"
}, {
  name: "Uganda",
  code: "ug"
}, {
  name: "United Arab Emirates",
  code: "ae"
}, {
  name: "Zambia",
  code: "zm"
}, {
  name: "Zimbabwe",
  code: "zw"
}, {
  name: "Argentina",
  code: "ar"
}, {
  name: "Australia",
  code: "au"
}, {
  name: "Bangladesh",
  code: "bd"
}, {
  name: "Brazil",
  code: "br"
}, {
  name: "Chile",
  code: "cl"
}, {
  name: "Colombia",
  code: "co"
}, {
  name: "Mainland China",
  code: "cn"
}, {
  name: "Hong Kong, China",
  code: "hk"
}, {
  name: "India",
  code: "in"
}, {
  name: "Indonesia",
  code: "id"
}, {
  name: "Japan",
  code: "jp"
}, {
  name: "South Korea",
  code: "kr"
}, {
  name: "Sri Lanka",
  code: "lk"
}, {
  name: "Malaysia",
  code: "my"
}, {
  name: "Mexico",
  code: "mx"
}, {
  name: "New Zealand",
  code: "nz"
}, {
  name: "Pakistan",
  code: "pk"
}, {
  name: "Peru",
  code: "pe"
}, {
  name: "Philippines",
  code: "ph"
}, {
  name: "Singapore",
  code: "sg"
}, {
  name: "Taiwan, China",
  code: "tw"
}, {
  name: "Thailand",
  code: "th"
}, {
  name: "Venezuela",
  code: "ve"
}, {
  name: "Vietnam",
  code: "vn"
}];
class TradingViewWidgetCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open"
    });
  }
  setConfig(_0x8c2ec6) {
    if (!_0x8c2ec6 || !_0x8c2ec6.widget_type) {
      throw new Error("Widget type must be specified.");
    }
    this._config = _0x8c2ec6;
    const _0x179a00 = this.shadowRoot;
    _0x179a00.innerHTML = "";
    const _0x393781 = _0x8c2ec6.widget_type;
    const _0x4549d1 = document.createElement("ha-card");
    if (_0x8c2ec6.title) {
      _0x4549d1.header = _0x8c2ec6.title;
    }
    const _0x9f3ab6 = document.createElement("iframe");
    _0x9f3ab6.style.width = _0x8c2ec6.width || "100%";
    const _0x395334 = ["news", "market-overview", "stock-market-hotlists", "market-quotes"].includes(_0x393781);
    _0x9f3ab6.style.height = _0x8c2ec6.height || (_0x395334 ? "550px" : "100%");
    _0x9f3ab6.style.border = "0";
    _0x9f3ab6.setAttribute("scrolling", "no");
    _0x9f3ab6.setAttribute("allowtransparency", "true");
    _0x9f3ab6.setAttribute("frameborder", "0");
    if (["news", "market-overview", "stock-market-hotlists", "market-quotes"].includes(_0x393781)) {
      const _0x279665 = {
        colorTheme: _0x8c2ec6.color_theme || "dark",
        isTransparent: _0x8c2ec6.is_transparent || false,
        width: "100%",
        height: "100%",
        locale: _0x8c2ec6.locale || "en"
      };
      let _0x26c4a0 = _0x279665;
      let _0x1f70da = "";
      if (_0x393781 === "news") {
        _0x1f70da = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
        _0x26c4a0.displayMode = _0x8c2ec6.display_mode || "adaptive";
        if (_0x8c2ec6.feed_mode === "market" && _0x8c2ec6.market) {
          _0x26c4a0.feedMode = "market";
          _0x26c4a0.market = _0x8c2ec6.market;
        } else if (_0x8c2ec6.feed_mode === "symbol" && _0x8c2ec6.symbol) {
          _0x26c4a0.feedMode = "symbol";
          _0x26c4a0.symbol = _0x8c2ec6.symbol;
        } else {
          _0x26c4a0.feedMode = "all_symbols";
        }
      } else if (_0x393781 === "market-overview") {
        _0x1f70da = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
        _0x26c4a0.dateRange = _0x8c2ec6.date_range || "12M";
        _0x26c4a0.showChart = _0x8c2ec6.show_chart !== false;
        _0x26c4a0.showFloatingTooltip = _0x8c2ec6.show_floating_tooltip !== false;
        _0x26c4a0.plotLineColorGrowing = "rgba(41, 98, 255, 1)";
        _0x26c4a0.plotLineColorFalling = "rgba(41, 98, 255, 1)";
        _0x26c4a0.gridLineColor = "rgba(240, 243, 250, 0)";
        _0x26c4a0.scaleFontColor = "rgba(120, 123, 134, 1)";
        _0x26c4a0.belowLineFillColorGrowing = "rgba(41, 98, 255, 0.12)";
        _0x26c4a0.belowLineFillColorFalling = "rgba(41, 98, 255, 0.12)";
        _0x26c4a0.belowLineFillColorGrowingBottom = "rgba(41, 98, 255, 0)";
        _0x26c4a0.belowLineFillColorFallingBottom = "rgba(41, 98, 255, 0)";
        _0x26c4a0.symbolActiveColor = "rgba(41, 98, 255, 0.12)";
        if (_0x8c2ec6.tab_config) {
          _0x26c4a0.tabs = this._parseTabsConfig(_0x8c2ec6.tab_config);
        } else {
          _0x26c4a0.tabs = [{
            title: "Indices",
            symbols: [{
              s: "FOREXCOM:SPXUSD",
              d: "S&P 500"
            }, {
              s: "FOREXCOM:NSXUSD",
              d: "US 100"
            }, {
              s: "FOREXCOM:DJI",
              d: "Dow 30"
            }, {
              s: "INDEX:NKY",
              d: "Nikkei 225"
            }, {
              s: "INDEX:DEU40",
              d: "DAX Index"
            }, {
              s: "FOREXCOM:UKXGBP",
              d: "FTSE 100"
            }]
          }, {
            title: "Futures",
            symbols: [{
              s: "BMFBOVESPA:ISP1!",
              d: "S&P 500"
            }, {
              s: "BMFBOVESPA:EUR1!",
              d: "Euro"
            }, {
              s: "CMCMARKETS:GOLD",
              d: "Gold"
            }, {
              s: "PYTH:WTI3!",
              d: "WTI Crude Oil"
            }]
          }, {
            title: "Forex",
            symbols: [{
              s: "FX:EURUSD",
              d: "EUR/USD"
            }, {
              s: "FX:GBPUSD",
              d: "GBP/USD"
            }, {
              s: "FX:USDJPY",
              d: "USD/JPY"
            }, {
              s: "FX:USDCHF",
              d: "USD/CHF"
            }, {
              s: "FX:AUDUSD",
              d: "AUD/USD"
            }, {
              s: "FX:USDCAD",
              d: "USD/CAD"
            }]
          }];
        }
      } else if (_0x393781 === "stock-market-hotlists") {
        _0x1f70da = "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js";
        _0x26c4a0.exchange = _0x8c2ec6.exchange || "US Exchanges";
        _0x26c4a0.dateRange = _0x8c2ec6.date_range || "12M";
        _0x26c4a0.showChart = _0x8c2ec6.show_chart !== false;
        _0x26c4a0.showFloatingTooltip = _0x8c2ec6.show_floating_tooltip !== false;
        _0x26c4a0.plotLineColorGrowing = "rgba(41, 98, 255, 1)";
        _0x26c4a0.plotLineColorFalling = "rgba(41, 98, 255, 1)";
        _0x26c4a0.gridLineColor = "rgba(240, 243, 250, 0)";
        _0x26c4a0.scaleFontColor = "rgba(120, 123, 134, 1)";
        _0x26c4a0.belowLineFillColorGrowing = "rgba(41, 98, 255, 0.12)";
        _0x26c4a0.belowLineFillColorFalling = "rgba(41, 98, 255, 0.12)";
        _0x26c4a0.belowLineFillColorGrowingBottom = "rgba(41, 98, 255, 0)";
        _0x26c4a0.belowLineFillColorFallingBottom = "rgba(41, 98, 255, 0)";
        _0x26c4a0.symbolActiveColor = "rgba(41, 98, 255, 0.12)";
        _0x26c4a0.showSymbolLogo = false;
        _0x26c4a0.largeChartUrl = "";
      } else if (_0x393781 === "market-quotes") {
        _0x1f70da = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
        _0x26c4a0.showSymbolLogo = _0x8c2ec6.show_symbol_logo !== false;
        if (_0x8c2ec6.tab_config) {
          const _0x5aefa9 = this._parseTabsConfig(_0x8c2ec6.tab_config);
          if (_0x5aefa9) {
            _0x26c4a0.symbolsGroups = _0x5aefa9.map(_0x21b6f5 => ({
              name: _0x21b6f5.title,
              symbols: _0x21b6f5.symbols.map(_0x5cddd3 => ({
                name: _0x5cddd3.s
              }))
            }));
          }
        } else {
          _0x26c4a0.symbolsGroups = [{
            name: "Indices",
            symbols: [{
              name: "FOREXCOM:SPXUSD",
              displayName: "S&P 500 Index"
            }, {
              name: "FOREXCOM:NSXUSD",
              displayName: "US 100 Cash CFD"
            }, {
              name: "FOREXCOM:DJI",
              displayName: "Dow Jones Industrial Average Index"
            }, {
              name: "INDEX:NKY",
              displayName: "Japan 225"
            }, {
              name: "INDEX:DEU40",
              displayName: "DAX Index"
            }, {
              name: "FOREXCOM:UKXGBP",
              displayName: "FTSE 100 Index"
            }]
          }, {
            name: "Futures",
            symbols: [{
              name: "BMFBOVESPA:ISP1!",
              displayName: "S&P 500"
            }, {
              name: "BMFBOVESPA:EUR1!",
              displayName: "Euro"
            }, {
              name: "CMCMARKETS:GOLD",
              displayName: "Gold"
            }, {
              name: "PYTH:WTI3!",
              displayName: "WTI Crude Oil"
            }, {
              name: "BMFBOVESPA:CCM1!",
              displayName: "Corn"
            }]
          }, {
            name: "Bonds",
            symbols: [{
              name: "EUREX:FGBL1!",
              displayName: "Euro Bund"
            }, {
              name: "EUREX:FBTP1!",
              displayName: "Euro BTP"
            }, {
              name: "EUREX:FGBM1!",
              displayName: "Euro BOBL"
            }]
          }, {
            name: "Forex",
            symbols: [{
              name: "FX:EURUSD",
              displayName: "EUR to USD"
            }, {
              name: "FX:GBPUSD",
              displayName: "GBP to USD"
            }, {
              name: "FX:USDJPY",
              displayName: "USD to JPY"
            }, {
              name: "FX:USDCHF",
              displayName: "USD to CHF"
            }, {
              name: "FX:AUDUSD",
              displayName: "AUD to USD"
            }, {
              name: "FX:USDCAD",
              displayName: "USD to CAD"
            }]
          }];
        }
      }
      const _0x1a2498 = "\n        <html>\n          <head>\n            <style>body { margin: 0; overflow: hidden; }</style>\n          </head>\n          <body>\n            <div class=\"tradingview-widget-container\">\n              <div class=\"tradingview-widget-container__widget\"></div>\n              <script type=\"text/javascript\" src=\"" + _0x1f70da + "\" async>\n              " + JSON.stringify(_0x26c4a0, null, 2) + "\n              </script>\n            </div>\n          </body>\n        </html>";
      _0x9f3ab6.src = "data:text/html;charset=utf-8," + encodeURIComponent(_0x1a2498);
      _0x4549d1.appendChild(_0x9f3ab6);
      _0x179a00.appendChild(_0x4549d1);
      return;
    }
    const _0x249088 = WIDGET_CONFIGS[_0x393781];
    const _0x7ca927 = {
      colorTheme: _0x8c2ec6.color_theme || "dark",
      width: _0x8c2ec6.width || "100%",
      height: _0x8c2ec6.height || "100%",
      isTransparent: _0x8c2ec6.is_transparent || false
    };
    const _0x225392 = _0x7ca927;
    switch (_0x393781) {
      case "forex-cross-rates":
      case "forex-heat-map":
        _0x225392.currencies = _0x8c2ec6.currencies;
        _0x225392.backgroundColor = _0x8c2ec6.background_color;
        _0x225392.isMonoSize = _0x8c2ec6.is_mono_size || false;
        break;
      case "stock-heatmap":
      case "etf-heatmap":
        _0x225392.dataSource = _0x8c2ec6.data_source;
        _0x225392.blockSize = _0x8c2ec6.block_size || (_0x393781 === "stock-heatmap" ? "market_cap_basic" : "volume");
        _0x225392.blockColor = _0x8c2ec6.block_color || "change";
        _0x225392.grouping = _0x8c2ec6.grouping || (_0x393781 === "stock-heatmap" ? "sector" : "asset_class");
        _0x225392.isMonoSize = _0x8c2ec6.is_mono_size || false;
        if (_0x393781 === "stock-heatmap") {
          _0x225392.exchange = _0x8c2ec6.exchange || "";
        }
        _0x225392.hasTopBar = _0x8c2ec6.has_top_bar;
        _0x225392.isZoomEnabled = _0x8c2ec6.is_zoom_enabled;
        _0x225392.hasSymbolTooltip = _0x8c2ec6.has_symbol_tooltip;
        _0x225392.isDataSetEnabled = _0x8c2ec6.is_data_set_enabled;
        break;
      case "single-quote":
      case "technical-analysis":
        _0x225392.symbol = String(_0x8c2ec6.pairs[0]);
        if (_0x393781 === "technical-analysis") {
          _0x225392.interval = _0x8c2ec6.interval || "1D";
          _0x225392.showIntervalTabs = _0x8c2ec6.show_interval_tabs !== false;
          _0x225392.displayMode = _0x8c2ec6.display_mode || "single";
        }
        break;
      case "economic-calendar":
        _0x225392.countryFilter = _0x8c2ec6.country_filter || undefined;
        _0x225392.importanceFilter = _0x8c2ec6.importance_filter || "-1,0,1";
        break;
      case "tickers":
      case "ticker-tape":
        _0x225392.symbols = _0x8c2ec6.pairs.map(_0x45e208 => typeof _0x45e208 === "object" && _0x45e208.proName && _0x45e208.title ? {
          proName: _0x45e208.proName,
          title: _0x45e208.title
        } : {
          proName: String(_0x45e208),
          title: String(_0x45e208).split(":").pop()
        });
        _0x225392.showSymbolLogo = _0x8c2ec6.show_symbol_logo !== false;
        _0x225392.largeChartUrl = _0x8c2ec6.large_chart_url || "";
        if (_0x393781 === "ticker-tape") {
          _0x225392.displayMode = _0x8c2ec6.display_mode || "adaptive";
        }
        break;
    }
    Object.keys(_0x225392).forEach(_0x129bc8 => {
      if (_0x225392[_0x129bc8] === undefined) {
        delete _0x225392[_0x129bc8];
      }
    });
    _0x9f3ab6.src = _0x249088.baseUrl + "?locale=" + (_0x8c2ec6.locale || "en") + "#" + encodeURIComponent(JSON.stringify(_0x225392));
    _0x4549d1.appendChild(_0x9f3ab6);
    _0x179a00.appendChild(_0x4549d1);
  }
  _parseTabsConfig(_0x986fb6) {
    const _0x1e4d10 = [];
    let _0x5b31b4 = null;
    const _0x10ab9f = _0x986fb6.split("\n");
    _0x10ab9f.forEach(_0x32c43a => {
      const _0x3173a8 = _0x32c43a.trim();
      if (!_0x3173a8) {
        return;
      }
      if (_0x3173a8.endsWith(":")) {
        const _0xf5add4 = _0x3173a8.slice(0, -1);
        const _0x17bc07 = {
          title: _0xf5add4,
          originalTitle: _0xf5add4,
          symbols: []
        };
        _0x5b31b4 = _0x17bc07;
        _0x1e4d10.push(_0x5b31b4);
      } else if (_0x3173a8.startsWith("-") && _0x5b31b4) {
        let _0x4dc7e9 = _0x3173a8.substring(1).trim();
        if (_0x4dc7e9) {
          _0x5b31b4.symbols.push({
            s: _0x4dc7e9
          });
        }
      }
    });
    if (_0x1e4d10.length > 0) {
      return _0x1e4d10;
    } else {
      return null;
    }
  }
  getCardSize() {
    if (!this._config) {
      return 1;
    }
    const _0x37be9f = this._config;
    if (["news", "market-overview", "stock-market-hotlists", "market-quotes"].includes(_0x37be9f.widget_type)) {
      return 10;
    }
    const _0x267f19 = _0x37be9f.height;
    const _0x4dfd98 = ["stock-heatmap", "etf-heatmap"].includes(_0x37be9f.widget_type);
    let _0x1b46a1 = 0;
    if (typeof _0x267f19 === "string" && _0x267f19.endsWith("px")) {
      _0x1b46a1 = parseFloat(_0x267f19);
    } else if (typeof _0x267f19 === "string" && _0x267f19.endsWith("%")) {
      _0x1b46a1 = _0x4dfd98 ? 400 : 500;
    } else {
      _0x1b46a1 = parseFloat(_0x267f19) || (_0x4dfd98 ? 400 : 50);
    }
    return Math.max(1, Math.ceil(_0x1b46a1 / 50));
  }
  set hass(_0x444f14) {}
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
const _0x1e8891 = {
  widget_type: "economic-calendar",
  height: "600px",
  country_filter: undefined,
  title: "",
  color_theme: "dark",
  locale: "en",
  width: "100%",
  is_transparent: false
};
const _0x7b13f5 = {
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
  "economic-calendar": _0x1e8891,
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
const WIDGET_DEFAULTS = _0x7b13f5;
class TradingViewWidgetCardEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: {
        state: true
      }
    };
  }
  setConfig(_0x50549b) {
    this._config = _0x50549b;
  }
  _valueChanged(_0x3666c3) {
    const _0x12fe06 = _0x3666c3.target;
    const _0x527a3c = _0x12fe06.configValue;
    let _0x1277c4 = _0x12fe06.checked !== undefined ? _0x12fe06.checked : _0x12fe06.value;
    if (this._config[_0x527a3c] === _0x1277c4) {
      return;
    }
    let _0x1ab702;
    if (_0x527a3c === "widget_type") {
      const _0x21a91d = WIDGET_DEFAULTS[_0x1277c4] || {};
      const _0x4a6999 = {
        color_theme: this._config.color_theme || "dark",
        locale: this._config.locale || "en",
        is_transparent: this._config.is_transparent !== undefined ? this._config.is_transparent : _0x21a91d.is_transparent || false,
        title: this._config.title
      };
      const _0x847ecc = {
        type: "custom:tradingview-widget-card",
        ..._0x21a91d,
        ..._0x4a6999
      };
      _0x1ab702 = _0x847ecc;
    } else {
      const _0x1cbc10 = {
        ...this._config
      };
      _0x1ab702 = _0x1cbc10;
      if (_0x527a3c === "pairs" || _0x527a3c === "currencies" || _0x527a3c === "country_filter") {
        if (!["market-overview", "stock-market-hotlists", "market-quotes"].includes(_0x1ab702.widget_type)) {
          if (["single-quote", "technical-analysis"].includes(_0x1ab702.widget_type) && _0x527a3c === "pairs") {
            _0x1277c4 = _0x1277c4.trim() ? [_0x1277c4.trim()] : [];
          } else if (_0x1ab702.widget_type === "economic-calendar" && _0x527a3c === "country_filter") {
            _0x1277c4 = Array.isArray(_0x1277c4) ? _0x1277c4.map(_0x5af34b => _0x5af34b.trim()).filter(Boolean).join(",") : _0x1277c4;
          } else {
            _0x1277c4 = _0x1277c4.split(",").map(_0x218878 => _0x218878.trim()).filter(Boolean);
          }
          if (Array.isArray(_0x1277c4) && _0x1277c4.length === 0) {
            delete _0x1ab702[_0x527a3c];
          } else {
            _0x1ab702[_0x527a3c] = _0x1277c4;
          }
        }
      } else if (typeof _0x1277c4 === "boolean") {
        _0x1ab702[_0x527a3c] = _0x1277c4;
      } else if (_0x1277c4 === "") {
        delete _0x1ab702[_0x527a3c];
      } else {
        _0x1ab702[_0x527a3c] = _0x1277c4;
      }
      if (_0x527a3c === "feed_mode") {
        if (_0x1ab702.feed_mode !== "symbol") {
          delete _0x1ab702.symbol;
        }
        if (_0x1ab702.feed_mode !== "market") {
          delete _0x1ab702.market;
        }
        if (_0x1ab702.feed_mode === "market" && !_0x1ab702.market) {
          _0x1ab702.market = "crypto";
        }
      }
    }
    this._config = _0x1ab702;
    this._dispatchConfigChanged(_0x1ab702);
  }
  _dispatchConfigChanged(_0x37f72f) {
    const _0xcfcff0 = {
      config: _0x37f72f
    };
    const _0x35c8cb = {
      detail: _0xcfcff0,
      bubbles: true,
      composed: true
    };
    this.dispatchEvent(new CustomEvent("config-changed", _0x35c8cb));
  }
  _addCurrency(_0xb168ba) {
    if (!_0xb168ba.target.value) {
      return;
    }
    const _0x567437 = _0xb168ba.target.value;
    const _0x3dac71 = this._config.currencies || [];
    if (!_0x3dac71.includes(_0x567437)) {
      const _0x378655 = {
        ...this._config,
        currencies: [..._0x3dac71, _0x567437].sort()
      };
      this._config = _0x378655;
      this._dispatchConfigChanged(_0x378655);
    }
    _0xb168ba.target.value = null;
  }
  _removeCurrency(_0x497c21) {
    const _0x453590 = _0x497c21.currentTarget.currency;
    const _0x1ae691 = this._config.currencies || [];
    const _0x150ee0 = {
      ...this._config,
      currencies: _0x1ae691.filter(_0x5240b4 => _0x5240b4 !== _0x453590)
    };
    this._config = _0x150ee0;
    this._dispatchConfigChanged(_0x150ee0);
  }
  _addCountry(_0x1aedaa) {
    if (_0x1aedaa.target.value === null || _0x1aedaa.target.value === undefined) {
      return;
    }
    const _0x5d316f = _0x1aedaa.target.value;
    let _0x259e49 = this._config.country_filter ? this._config.country_filter.split(",") : [];
    let _0x4d6f11 = [..._0x259e49];
    if (_0x5d316f.includes(",")) {
      const _0x12df8f = _0x5d316f.split(",");
      _0x12df8f.forEach(_0x4737da => {
        if (!_0x4d6f11.includes(_0x4737da)) {
          _0x4d6f11.push(_0x4737da);
        }
      });
    } else if (!_0x4d6f11.includes(_0x5d316f)) {
      _0x4d6f11.push(_0x5d316f);
    }
    _0x4d6f11.sort();
    const _0x30fc8e = {
      ...this._config,
      country_filter: _0x4d6f11.join(",")
    };
    this._config = _0x30fc8e;
    this._dispatchConfigChanged(_0x30fc8e);
    _0x1aedaa.target.value = null;
  }
  _removeCountry(_0x97cff2) {
    const _0x23a9a9 = _0x97cff2.currentTarget.country;
    let _0x40084d = this._config.country_filter ? this._config.country_filter.split(",") : [];
    let _0x237d8e = _0x40084d.filter(_0x5da7e5 => _0x5da7e5 !== _0x23a9a9);
    const _0x2c3843 = {
      ...this._config,
      country_filter: _0x237d8e.join(",") === "" ? undefined : _0x237d8e.join(",")
    };
    this._config = _0x2c3843;
    this._dispatchConfigChanged(_0x2c3843);
  }
  render() {
    if (!this.hass) {
      return html``;
    }
    const _0xfd12b0 = this._config || {};
    const _0x3ac566 = _0xfd12b0.widget_type || "ticker-tape";
    return html`
      <div class="card-config">
        <ha-textfield
          label="Title (Optional)"
          .value=${_0xfd12b0.title || ""}
          .configValue=title
          @input=${this._valueChanged}
        ></ha-textfield>

        <ha-select
          label="Widget Type"
          .value=${_0x3ac566}
          .configValue=widget_type
          @selected=${this._valueChanged}
          @closed=${_0x211845 => _0x211845.stopPropagation()}
          fixedMenuPosition
          naturalMenuWidth
        >
          ${Object.keys(WIDGET_CONFIGS).map(_0x2aeb87 => html`
            <mwc-list-item .value=${_0x2aeb87}>
              ${_0x2aeb87.replace(/-/g, " ").replace(/\b\w/g, _0x4dd6fd => _0x4dd6fd.toUpperCase())}
            </mwc-list-item>
          `)}
        </ha-select>

        ${this._renderDynamicOptions(_0x3ac566, _0xfd12b0)}

        <div class="grid">
            <ha-select
              label="Color Theme"
              .value=${_0xfd12b0.color_theme || "dark"}
              .configValue=color_theme
              @selected=${this._valueChanged}
              @closed=${_0x407e5b => _0x407e5b.stopPropagation()}
              fixedMenuPosition
            >
              <mwc-list-item value="dark">Dark</mwc-list-item>
              <mwc-list-item value="light">Light</mwc-list-item>
            </ha-select>
            <ha-select
              label="Language"
              .value=${_0xfd12b0.locale || "en"}
              .configValue=locale
              @selected=${this._valueChanged}
              @closed=${_0x2e043e => _0x2e043e.stopPropagation()}
              fixedMenuWidth
              fixedMenuPosition
            >
              <mwc-list-item value="en">English</mwc-list-item><mwc-list-item value="tr">Türkçe</mwc-list-item><mwc-list-item value="de">Deutsch</mwc-list-item><mwc-list-item value="fr">Français</mwc-list-item><mwc-list-item value="in">English (India)</mwc-list-item><mwc-list-item value="ca_ES">Català</mwc-list-item><mwc-list-item value="es">Español</mwc-list-item><mwc-list-item value="it">Italiano</mwc-list-item><mwc-list-item value="pl">Polski</mwc-list-item><mwc-list-item value="hu_HU">Magyar</mwc-list-item><mwc-list-item value="sv_SE">Svenska</mwc-list-item><mwc-list-item value="ru">Русский</mwc-list-item><mwc-list-item value="br">Português</mwc-list-item><mwc-list-item value="id">Bahasa Indonesia</mwc-list-item><mwc-list-item value="ms_MY">Bahasa Melayu</mwc-list-item><mwc-list-item value="th_TH">ภาษาไทย</mwc-list-item><mwc-list-item value="vi_VN">Tiếng Việt</mwc-list-item><mwc-list-item value="ja">日本語</mwc-list-item><mwc-list-item value="kr">한국어</mwc-list-item><mwc-list-item value="zh_CN">简体中文</mwc-list-item><mwc-list-item value="zh_TW">繁體中文</mwc-list-item><mwc-list-item value="ar_AE">العربية</mwc-list-item><mwc-list-item value="he_IL">עברית</mwc-list-item>
            </ha-select>
        </div>

        <div class="grid">
            <ha-textfield
              label="Height (e.g. 50px, 100%)"
              .value=${_0xfd12b0.height || ""}
              .configValue=height
              @input=${this._valueChanged}
              placeholder="Default (widget specific)"
            ></ha-textfield>
            <ha-textfield
              label="Width (e.g. 500px, 100%)"
              .value=${_0xfd12b0.width || ""}
              .configValue=width
              @input=${this._valueChanged}
              placeholder="Default (100%)"
            ></ha-textfield>
        </div>

        ${_0x3ac566 !== "forex-cross-rates" ? html`
            <div class="inline-switch">
                <ha-formfield .label=Transparent Background>
                  <ha-switch
                    .checked=${_0xfd12b0.is_transparent || false}
                    .configValue=is_transparent
                    @change=${this._valueChanged}
                  ></ha-switch>
                </ha-formfield>
              ${["ticker-tape", "tickers", "market-quotes"].includes(_0xfd12b0.widget_type) ? html`
                <ha-formfield .label=Show Symbol Logo>
                  <ha-switch
                    .checked=${_0xfd12b0.show_symbol_logo !== false}
                    .configValue=show_symbol_logo
                    @change=${this._valueChanged}
                  ></ha-switch>
                </ha-formfield>
              ` : ""}
            </div>
        ` : ""}
      </div>
    `;
  }
  _renderDynamicOptions(_0x3d9c34, _0x47f9a9) {
    if (!_0x3d9c34) {
      return html``;
    }
    if (_0x3d9c34 === "market-overview" || _0x3d9c34 === "market-quotes") {
      return html`
            <div class="textarea-container">
                <label>Tabs & Symbols Configuration</label>
                <textarea
                    class="native-textarea"
                    .value=${_0x47f9a9.tab_config || ""}
                    @input=${_0x2f90e5 => this._valueChanged({
        target: {
          configValue: "tab_config",
          value: _0x2f90e5.target.value
        }
      })}
                    rows="10"
                ></textarea>
                <div class="helper-text">Format: "TabName:" new line "- Symbol"</div>
            </div>
            
            ${_0x3d9c34 === "market-overview" ? html`
            <div class="grid">
                <ha-select label="Date Range" .value=${_0x47f9a9.date_range || "12M"} .configValue=date_range @selected=${this._valueChanged} @closed=${_0x22af46 => _0x22af46.stopPropagation()} fixedMenuPosition>
                    <mwc-list-item value="1D">1 Day</mwc-list-item>
                    <mwc-list-item value="1M">1 Month</mwc-list-item>
                    <mwc-list-item value="3M">3 Months</mwc-list-item>
                    <mwc-list-item value="12M">1 Year</mwc-list-item>
                    <mwc-list-item value="60M">5 Years</mwc-list-item>
                    <mwc-list-item value="ALL">All</mwc-list-item>
                </ha-select>
            </div>

            <div class="switch-container">
                <ha-formfield label="Show Chart"><ha-switch .checked=${_0x47f9a9.show_chart !== false} .configValue=show_chart @change=${this._valueChanged}></ha-switch></ha-formfield>
                <ha-formfield label="Floating Tooltip"><ha-switch .checked=${_0x47f9a9.show_floating_tooltip !== false} .configValue=show_floating_tooltip @change=${this._valueChanged}></ha-switch></ha-formfield>
            </div>
            ` : ""}
        `;
    }
    if (_0x3d9c34 === "stock-market-hotlists") {
      return html`
        <ha-select label="Exchange" .value=${_0x47f9a9.exchange || "US Exchanges"} .configValue=exchange @selected=${this._valueChanged} @closed=${_0x47b214 => _0x47b214.stopPropagation()} fixedMenuPosition>
            ${HOTLIST_EXCHANGES.map(_0x52d11f => html`<mwc-list-item value="${_0x52d11f.v}">${_0x52d11f.l}</mwc-list-item>`)}
        </ha-select>
        
        <div class="grid">
            <ha-select label="Date Range" .value=${_0x47f9a9.date_range || "12M"} .configValue=date_range @selected=${this._valueChanged} @closed=${_0x4c5f15 => _0x4c5f15.stopPropagation()} fixedMenuPosition>
                <mwc-list-item value="1D">1 Day</mwc-list-item>
                <mwc-list-item value="1M">1 Month</mwc-list-item>
                <mwc-list-item value="3M">3 Months</mwc-list-item>
                <mwc-list-item value="12M">1 Year</mwc-list-item>
                <mwc-list-item value="60M">5 Years</mwc-list-item>
                <mwc-list-item value="ALL">All</mwc-list-item>
            </ha-select>
        </div>

        <div class="switch-container">
            <ha-formfield label="Show Chart"><ha-switch .checked=${_0x47f9a9.show_chart !== false} .configValue=show_chart @change=${this._valueChanged}></ha-switch></ha-formfield>
            <ha-formfield label="Floating Tooltip"><ha-switch .checked=${_0x47f9a9.show_floating_tooltip !== false} .configValue=show_floating_tooltip @change=${this._valueChanged}></ha-switch></ha-formfield>
        </div>
      `;
    }
    const _0x5aeff1 = (_0x2e8cbb, _0x239ef7, _0x31d01e, _0x26e01f) => html`
      <ha-textfield
        label=${_0x2e8cbb}
        .value=${_0x31d01e}
        .configValue=${_0x26e01f}
        helper=${_0x239ef7}
        @input=${this._valueChanged}
      ></ha-textfield>`;
    const _0x58fd8b = (_0x1eda46, _0x374e17, _0x50e8e3) => html`
      <ha-formfield .label=${_0x1eda46}>
        <ha-switch
          .checked=${_0x374e17}
          .configValue=${_0x50e8e3}
          @change=${this._valueChanged}
        ></ha-switch>
      </ha-formfield>`;
    const _0x2aef0f = [{
      id: "AllAUEtf",
      label: "Australia"
    }, {
      id: "AllCAEtf",
      label: "Canada"
    }, {
      id: "AllFREtf",
      label: "France"
    }, {
      id: "AllDEEtf",
      label: "Germany"
    }, {
      id: "AllHKEtf",
      label: "Hong Kong, China"
    }, {
      id: "AllINEtf",
      label: "India"
    }, {
      id: "AllILEtf",
      label: "Israel"
    }, {
      id: "AllITEtf",
      label: "Italy"
    }, {
      id: "AllJPEtf",
      label: "Japan"
    }, {
      id: "AllLUEtf",
      label: "Luxembourg"
    }, {
      id: "AllMYEtf",
      label: "Malaysia"
    }, {
      id: "AllNLEtf",
      label: "Netherlands"
    }, {
      id: "AllNZEtf",
      label: "New Zealand"
    }, {
      id: "AllROEtf",
      label: "Romania"
    }, {
      id: "AllSGPEtf",
      label: "Singapore"
    }, {
      id: "AllESEtf",
      label: "Spain"
    }, {
      id: "AllCHEEtf",
      label: "Switzerland"
    }, {
      id: "AllTWEtf",
      label: "Taiwan, China"
    }, {
      id: "AllTHEtf",
      label: "Thailand"
    }, {
      id: "AllTREtf",
      label: "Turkey"
    }, {
      id: "AllAREEtf",
      label: "UAE"
    }, {
      id: "AllUKEtf",
      label: "UK"
    }, {
      id: "AllUSEtf",
      label: "USA"
    }, {
      id: "AllVNEtf",
      label: "Vietnam"
    }];
    switch (_0x3d9c34) {
      case "ticker-tape":
      case "tickers":
        return html`
          ${_0x5aeff1("Symbols (comma-separated)", "e.g: BINANCE:BTCUSDT,BIST:XU100", (_0x47f9a9.pairs || []).join(","), "pairs")}
          ${_0x3d9c34 === "ticker-tape" ? html`
            <ha-select label="Display Mode" .value=${_0x47f9a9.display_mode || "regular"} .configValue=display_mode @selected=${this._valueChanged} @closed=${_0x55bfe1 => _0x55bfe1.stopPropagation()} fixedMenuPosition>
              <mwc-list-item value="regular">Regular</mwc-list-item>
              <mwc-list-item value="adaptive">Adaptive</mwc-list-item>
              <mwc-list-item value="compact">Compact</mwc-list-item>
            </ha-select>
          ` : ""}
        `;
      case "single-quote":
      case "technical-analysis":
        const _0xb73398 = _0x3d9c34 === "technical-analysis" ? html`
          <div class="grid">
            <ha-select label="Time Interval" .value=${_0x47f9a9.interval || "1D"} .configValue=interval @selected=${this._valueChanged} @closed=${_0x58faa2 => _0x58faa2.stopPropagation()} fixedMenuPosition>
              ${["1m", "5m", "15m", "1H", "4H", "1D", "1W", "1M"].map(_0x3184a8 => html`<mwc-list-item .value=${_0x3184a8}>${_0x3184a8}</mwc-list-item>`)}
            </ha-select>
            ${_0x58fd8b("Show Interval Tabs", _0x47f9a9.show_interval_tabs !== false, "show_interval_tabs")}
          </div>
          <ha-select label="Display Mode" .value=${_0x47f9a9.display_mode || "single"} .configValue=display_mode @selected=${this._valueChanged} @closed=${_0x4bf88f => _0x4bf88f.stopPropagation()} fixedMenuPosition>
            <mwc-list-item value="single">Single</mwc-list-item>
            <mwc-list-item value="multiple">Multiple</mwc-list-item>
          </ha-select>
        ` : "";
        return html`${_0x5aeff1("Symbol", "Just one symbol. e.g: NASDAQ:AAPL", (_0x47f9a9.pairs || [""])[0], "pairs")}${_0xb73398}`;
      case "stock-heatmap":
      case "etf-heatmap":
        const _0x1f969d = _0x3d9c34 === "stock-heatmap";
        const _0x54506a = _0x1f969d ? [{
          v: "market_cap_basic",
          n: "Market cap"
        }, {
          v: "volume",
          n: "Volume 1D"
        }, {
          v: "volume|1W",
          n: "Volume 1W"
        }, {
          v: "volume|1M",
          n: "Volume 1M"
        }, {
          v: "Value.Traded",
          n: "Price * Volume (Turnover) 1D"
        }, {
          v: "Value.Traded|1W",
          n: "Price * Volume (Turnover) 1W"
        }, {
          v: "Value.Traded|1M",
          n: "Price * Volume (Turnover) 1M"
        }, {
          v: "monoSize",
          n: "Mono size"
        }] : [{
          v: "volume",
          n: "Volume 1D"
        }, {
          v: "volume|1W",
          n: "Volume 1W"
        }, {
          v: "volume|1M",
          n: "Volume 1M"
        }, {
          v: "Value.Traded",
          n: "Price * Volume (Turnover) 1D"
        }, {
          v: "Value.Traded|1W",
          n: "Price * Volume (Turnover) 1W"
        }, {
          v: "Value.Traded|1M",
          n: "Price * Volume (Turnover) 1M"
        }, {
          v: "monoSize",
          n: "Mono size"
        }];
        const _0xbb6d12 = ["asset_class", "no_group"];
        const _0x173a57 = [{
          value: "change|60",
          label: "Change 1h, %"
        }, {
          value: "change|240",
          label: "Change 4h, %"
        }, {
          value: "change",
          label: "Change D"
        }, {
          value: "Perf.W",
          label: "Performance W"
        }, {
          value: "Perf.1M",
          label: "Performance M"
        }, {
          value: "Perf.3M",
          label: "Performance 3M, %"
        }, {
          value: "Perf.6M",
          label: "Performance 6M, %"
        }, {
          value: "Perf.Y",
          label: "Performance Y, %"
        }, {
          value: "Perf.YTD",
          label: "Year-to-Date"
        }, {
          value: "premarket_change",
          label: "Pre-market Change, %"
        }, {
          value: "postmarket_change",
          label: "Post-market Change, %"
        }, {
          value: "relative_volume_10d_calc",
          label: "Relative Volume"
        }, {
          value: "Volatility.D",
          label: "Volatility D, %"
        }, {
          value: "gap",
          label: "Gap, %"
        }];
        const _0x36830c = [{
          value: "change",
          label: "Change D, %"
        }, {
          value: "Perf.W",
          label: "Performance W, %"
        }, {
          value: "Perf.1M",
          label: "Performance M, %"
        }, {
          value: "Perf.3M",
          label: "Performance 3M, %"
        }, {
          value: "Perf.6M",
          label: "Performance 6M, %"
        }, {
          value: "Perf.YTD",
          label: "Performance YTD, %"
        }, {
          value: "Perf.Y",
          label: "Performance Y, %"
        }, {
          value: "nav_total_return.1M",
          label: "NAV total return M"
        }, {
          value: "nav_total_return.3M",
          label: "NAV total return 3M"
        }, {
          value: "nav_total_return.YTD",
          label: "NAV total return YTD"
        }, {
          value: "nav_total_return.1Y",
          label: "NAV total return Y"
        }, {
          value: "nav_total_return.3Y",
          label: "NAV total return 3Y"
        }, {
          value: "weight_top_10",
          label: "Top 10 weight (% in top)"
        }, {
          value: "weight_top_25",
          label: "Top 25 weight (% in top)"
        }, {
          value: "Volatility.D",
          label: "Volatility D, %"
        }, {
          value: "Volatility.M",
          label: "Volatility M, %"
        }, {
          value: "beta_1_year",
          label: "Beta 1Y"
        }, {
          value: "beta_3_year",
          label: "Beta 3Y"
        }, {
          value: "beta_5_year",
          label: "Beta 5Y"
        }];
        return html`
          ${_0x1f969d ? _0x5aeff1("Data Source", "e.g: SPX500", _0x47f9a9.data_source || "", "data_source") : html`<ha-select label="Data Source" .value=${_0x47f9a9.data_source || ""} .configValue=data_source @selected=${this._valueChanged} @closed=${_0x2bbe69 => _0x2bbe69.stopPropagation()} fixedMenuPosition>${_0x2aef0f.map(_0x1437dd => html`<mwc-list-item value="${_0x1437dd.id}">${_0x1437dd.label}</mwc-list-item>`)}</ha-select>`}
          ${_0x1f969d ? _0x5aeff1("Exchange (Optional)", "e.g: NASDAQ", _0x47f9a9.exchange || "", "exchange") : ""}
          <div class="grid">
            <ha-select label="Grouping" .value=${_0x47f9a9.grouping || (_0x1f969d ? "sector" : "asset_class")} .configValue=grouping @selected=${this._valueChanged} @closed=${_0x229df9 => _0x229df9.stopPropagation()} fixedMenuPosition}>
              ${(_0x1f969d ? ["sector", "no_group"] : _0xbb6d12).map(_0x265632 => html`<mwc-list-item .value=${_0x265632}>${_0x265632.split("_").map(_0x76cfb0 => _0x76cfb0.charAt(0).toUpperCase() + _0x76cfb0.slice(1)).join(" ")}</mwc-list-item>`)}
            </ha-select>
            <ha-select label="Block Color" .value=${_0x47f9a9.block_color || "change"} .configValue=block_color @selected=${this._valueChanged} @closed=${_0x4e2268 => _0x4e2268.stopPropagation()} fixedMenuPosition}>
              ${_0x1f969d ? _0x173a57.map(_0x358a77 => html`<mwc-list-item value="${_0x358a77.value}">${_0x358a77.label}</mwc-list-item>`) : _0x36830c.map(_0x2aa828 => html`<mwc-list-item value="${_0x2aa828.value}">${_0x2aa828.label}</mwc-list-item>`)}
            </ha-select>
          </div>
          <ha-select label="Block Size" .value=${_0x47f9a9.block_size || (_0x1f969d ? "market_cap_basic" : "volume")} .configValue=block_size @selected=${this._valueChanged} @closed=${_0xab799f => _0xab799f.stopPropagation()} fixedMenuPosition}>
            ${_0x54506a.map(_0x2957b7 => html`<mwc-list-item .value=${_0x2957b7.v}>${_0x2957b7.n}</mwc-list-item>`)}
          </ha-select>
          
          <!-- DÜZELTME: ÇİFT GİRİŞ (Double Input) SORUNU ÇÖZÜLDÜ -->
          <!-- Color Theme, Language, Height, Width alanları buradan kaldırıldı çünkü ana render fonksiyonunda zaten varlar -->

          <!-- ESKİDEN OLAN AMA SİLİNEN ÖZELLİKLER GERİ EKLENDİ VE AKTİF HALE GETİRİLDİ -->
          <div class="switch-container">
            ${_0x58fd8b("Show Top Bar", _0x47f9a9.has_top_bar || false, "has_top_bar")}
            ${_0x58fd8b("Zoom Enabled", _0x47f9a9.is_zoom_enabled !== false, "is_zoom_enabled")}
            ${_0x58fd8b("Has Symbol Tooltip", _0x47f9a9.has_symbol_tooltip !== false, "has_symbol_tooltip")}
            ${_0x58fd8b("Data Set Enabled", _0x47f9a9.is_data_set_enabled || false, "is_data_set_enabled")}
            ${_0x58fd8b("Mono Size", _0x47f9a9.is_mono_size || false, "is_mono_size")}
          </div>
        `;
      case "forex-heat-map":
      case "forex-cross-rates":
        const _0x520953 = _0x47f9a9.currencies || [];
        const _0x17cf50 = FOREX_CURRENCIES.filter(_0x2b6e36 => !_0x520953.includes(_0x2b6e36));
        return html`
          <div class="currency-selector">
            <label id="currency-label">Currencies</label>
            <div class="tags-container" aria-labelledby="currency-label">
              ${_0x520953.map(_0x4fb07d => html`
                <span class="tag">
                  ${_0x4fb07d}
                  <button class="remove-btn" .currency=${_0x4fb07d} @click=${this._removeCurrency} title="Remove ${_0x4fb07d}">x</button>
                </span>
              `)}
            </div>
            <ha-select
                label="Add Currency"
                @selected=${this._addCurrency}
                @closed=${_0x2da11a => _0x2da11a.stopPropagation()}
                fixedMenuPosition
            >
              ${_0x17cf50.map(_0x5a7f00 => html`
                <mwc-list-item .value=${_0x5a7f00}>${_0x5a7f00}</mwc-list-item>
              `)}
            </ha-select>
          </div>
          ${_0x5aeff1("Background Color (Hex)", "e.g: #0F0F0F", _0x47f9a9.background_color || "", "background_color")}
        `;
      case "economic-calendar":
        const _0xc420f5 = _0x47f9a9.country_filter ? _0x47f9a9.country_filter.split(",") : [];
        const _0x46a397 = _0xc420f5.map(_0x4da3c6 => COUNTRIES_FOR_ECONOMIC_CALENDAR.find(_0x1868ae => _0x1868ae.code === _0x4da3c6)).filter(Boolean);
        const _0x3f7386 = COUNTRIES_FOR_ECONOMIC_CALENDAR.filter(_0x49b9d8 => {
          if (_0x49b9d8.code.includes(",")) {
            const _0x2e1d85 = _0x49b9d8.code.split(",");
            return !_0x2e1d85.every(_0xcdcbe2 => _0xc420f5.includes(_0xcdcbe2));
          }
          return !_0xc420f5.includes(_0x49b9d8.code);
        });
        return html`
          <div class="country-selector">
              <label id="country-label">Country Filter</label>
              <div class="tags-container" aria-labelledby="country-label">
                  ${_0x46a397.map(_0x2b7c8f => html`
                      <span class="tag">
                          ${_0x2b7c8f.name}
                          <button class="remove-btn" .country=${_0x2b7c8f.code} @click=${this._removeCountry} title="Remove ${_0x2b7c8f.name}">x</button>
                      </span>
                  `)}
              </div>
              <ha-select
                  label="Add Country"
                  @selected=${this._addCountry}
                  @closed=${_0xcd6f96 => _0xcd6f96.stopPropagation()}
                  fixedMenuPosition
              >
                  ${_0x3f7386.map(_0x5e11d3 => html`
                      <mwc-list-item .value=${_0x5e11d3.code}>${_0x5e11d3.name}</mwc-list-item>
                  `)}
              </ha-select>
          </div>
          <ha-select
              label="Importance Filter"
              .value=${_0x47f9a9.importance_filter || "-1,0,1"}
              .configValue=importance_filter
              @selected=${this._valueChanged}
              @closed=${_0x2eabaa => _0x2eabaa.stopPropagation()}
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
        const _0x771f36 = [{
          id: "crypto",
          label: "Cryptocurrencies"
        }, {
          id: "forex",
          label: "Currencies"
        }, {
          id: "stock",
          label: "Stocks"
        }, {
          id: "index",
          label: "Indices"
        }, {
          id: "futures",
          label: "Futures"
        }, {
          id: "cfd",
          label: "Bonds"
        }];
        return html`
          <ha-select label="Display Mode" .value=${_0x47f9a9.display_mode || "adaptive"} .configValue=display_mode @selected=${this._valueChanged} @closed=${_0x5b2b29 => _0x5b2b29.stopPropagation()} fixedMenuPosition>
            <mwc-list-item value="adaptive">Adaptive</mwc-list-item>
            <mwc-list-item value="regular">Regular</mwc-list-item>
            <mwc-list-item value="compact">Compact</mwc-list-item>
          </ha-select>
          <ha-select label="Feed Mode" .value=${_0x47f9a9.feed_mode || "all_symbols"} .configValue=feed_mode @selected=${this._valueChanged} @closed=${_0x520d3a => _0x520d3a.stopPropagation()} fixedMenuPosition>
            <mwc-list-item value="all_symbols">All Symbols</mwc-list-item>
            <mwc-list-item value="symbol">Symbol</mwc-list-item>
            <mwc-list-item value="market">Market</mwc-list-item>
          </ha-select>
          ${_0x47f9a9.feed_mode === "symbol" ? html`
            <ha-textfield
              label="Symbol"
              .value=${_0x47f9a9.symbol || ""}
              .configValue=symbol
              @input=${this._valueChanged}
            ></ha-textfield>
          ` : ""}
          ${_0x47f9a9.feed_mode === "market" ? html`
            <ha-select
              label="Market Type"
              .value=${_0x47f9a9.market || "crypto"}
              .configValue=market
              @selected=${this._valueChanged}
              @closed=${_0x56410d => _0x56410d.stopPropagation()}
              fixedMenuPosition
            >
              ${_0x771f36.map(_0x452454 => html`<mwc-list-item value=${_0x452454.id}>${_0x452454.label}</mwc-list-item>`)}
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
