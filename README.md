# **TradingView Widget Card for Home Assistant**

This custom card allows you to embed **13 different**, fully configurable TradingView widgets into your Home Assistant dashboards. With a single card file, you can display market data in a variety of formats.

This card is a bridge to Tradingview widgets and all card UI and visual rendering is managed directly by TradingView\!

## **✨ Features**

* **13 Widget Types in One:**  
  * ticker-tape (Scrolling horizontal bar)  
  * tickers (Vertical list of symbols)  
  * single-quote (Detailed view of one symbol)  
  * stock-heatmap (Market-wide sector visualization)  
  * etf-heatmap (Exchange-traded funds by region)  
  * forex-cross-rates (Currency matrix)  
  * forex-heat-map (Currency pair strength map)  
  * technical-analysis (Candlestick \+ indicators)  
  * economic-calendar (Macro data releases)  
  * news (Finance-focused news ticker)  
  * market-overview (Market Watchlist)  
  * stock-market-hotlists (Stock Market Watchlist)  
  * market-quotes (Detailed Market Watchlist)  
* **Highly Customizable:** Control display mode, theme, symbols, sizing (px or %), languages, filters, and more via YAML.  
* **Multi-language Support:** Over 20 languages supported including English, Turkish, German, French, etc.

## **🛠️ Installation**

### **HACS Installation (Recommended)**

1. If you don't have it, install [HACS](https://hacs.xyz/).  
2. Go to HACS \> Frontend.  
3. Click the three dots in the top right, add a custom repository: alfwro13/Tradingview-Widget-Card  
4. Search for TradingView Widget Card, select it, and install.  
5. Clear your browser or mobile HA app cache.  
6. Ctrl+F5 for browsers.

### **Manual Installation**

1. Download the tradingview-widget-card.js file from the latest release.  
2. Copy the file to your Home Assistant /www/Tradingview-Widget-Card/ directory.  
3. In Home Assistant, go to **Settings \> Dashboards**.  
4. Click the three dots in the top right and select **"Resources"**.  
5. Click **"Add Resource"** and enter:  
   * **URL:** /local/Tradingview-Widget-Card/tradingview-widget-card.js  
   * **Resource Type:** JavaScript Module  
6. Click **"Create"**, clear your browser's cache, and refresh with Ctrl+F5.

## **⚙️ Configuration Options**

This card is configured entirely via YAML. Below is a breakdown of the common options available to all widgets, followed by specific options for each widget type.

### **Common Options (Applies to all widgets)**

| Option | Default | Description |
| :---- | :---- | :---- |
| type | **Required** | Must be custom:tradingview-widget-card |
| widget\_type | **Required** | The type of widget to display (e.g., ticker-tape, stock-heatmap) |
| title | "" | Optional title to display above the widget in the HA Card |
| color\_theme | dark | Visual theme: dark or light |
| locale | en | Language code (e.g., en, de, fr, es, it, tr) |
| width | 100% | Card width (e.g., 100%, 500px) |
| height | 100% | Card height (e.g., 100%, 500px). *Note: Heatmaps default to 500px.* |
| is\_transparent | false | Whether the background should be transparent |

### **Widget-Specific Options**

#### **Ticker Tape & Tickers**

| Option | Default | Description |
| :---- | :---- | :---- |
| pairs | **Required** | List of symbol strings (e.g., \- BINANCE:BTCUSDT) |
| show\_symbol\_logo | true | Display the logo of the symbol |
| display\_mode | regular | **Ticker Tape only:** regular, adaptive, or compact |

#### **Single Quote & Technical Analysis**

| Option | Default | Description |
| :---- | :---- | :---- |
| pairs | **Required** | List containing exactly one symbol (e.g., \- OANDA:USDTRY) |
| interval | 1D | **TA only:** 1m, 5m, 15m, 1H, 4H, 1D, 1W, 1M |
| show\_interval\_tabs | true | **TA only:** Display the time interval selector |
| display\_mode | single | **TA only:** single or multiple |

#### **Stock Heatmap & ETF Heatmap**

| Option | Default | Description |
| :---- | :---- | :---- |
| data\_source | **Required** | Source index (e.g., SPX500 for Stock, AllUSEtf for ETF) |
| exchange | "" | **Stock only:** Specific exchange (e.g., NASDAQ) |
| grouping | sector / asset\_class | sector or no\_group (Stock) / asset\_class or no\_group (ETF) |
| block\_size | market\_cap\_basic / volume | market\_cap\_basic, volume, Value.Traded, monoSize, etc. |
| block\_color | change | change, change|60, change|240, Perf.W, Perf.1M, Perf.YTD, Volatility.D, etc. |
| has\_top\_bar | false | Show the top navigation bar |
| is\_zoom\_enabled | true | Allow zooming into blocks |
| has\_symbol\_tooltip | true | Show details when hovering over a block |
| is\_data\_set\_enabled | false | Show dataset selector |
| is\_mono\_size | false | Make all blocks the same size |

#### **Forex Cross Rates & Forex Heatmap**

| Option | Default | Description |
| :---- | :---- | :---- |
| currencies | **Required** | List of currency codes (e.g., \- EUR, \- USD, \- GBP) |
| background\_color | "" | Hex background color (e.g., \#000000) |
| is\_mono\_size | false | Make all blocks the same size |

#### **Economic Calendar**

| Option | Default | Description |
| :---- | :---- | :---- |
| country\_filter | "" | Comma-separated list of country codes (e.g., us,eu,tr) |
| importance\_filter | \-1,0,1 | \-1,0,1 (All), 1 (Low), 0 (Medium), \-1 (High), \-1,0, 0,1 |

#### **News**

| Option | Default | Description |
| :---- | :---- | :---- |
| display\_mode | adaptive | adaptive, regular, or compact |
| feed\_mode | all\_symbols | all\_symbols, symbol, or market |
| symbol | "" | Required if feed\_mode: symbol (e.g., NASDAQ:AAPL) |
| market | crypto | Required if feed\_mode: market. Options: crypto, forex, stock, index, futures, cfd |

#### **Market Overview & Market Quotes**

| Option | Default | Description |
| :---- | :---- | :---- |
| tab\_config | **Required** | Multi-line YAML string defining tabs and symbols (See examples) |
| date\_range | 12M | **Overview only:** 1D, 1M, 3M, 12M, 60M, ALL |
| show\_chart | true | **Overview only:** Show the sparkline chart |
| show\_floating\_tooltip | true | **Overview only:** Show tooltip on hover |
| show\_symbol\_logo | true | **Quotes only:** Display symbol logos |

#### **Stock Market Hotlists**

| Option | Default | Description |
| :---- | :---- | :---- |
| exchange | US Exchanges | Target exchange (e.g., US Exchanges, NASDAQ, NYSE) |
| date\_range | 12M | 1D, 1M, 3M, 12M, 60M, ALL |
| show\_chart | true | Show the sparkline chart |
| show\_floating\_tooltip | true | Show tooltip on hover |

## **📘 YAML Examples**

### **Ticker Tape**

\- type: custom:tradingview-widget-card  
  widget\_type: ticker-tape  
  title: Market Ticker  
  pairs:  
    \- OANDA:USDTRY  
    \- OANDA:EURTRY  
    \- BINANCE:BTCUSDTPERP  
    \- BIST:XU100  
  show\_symbol\_logo: true  
  display\_mode: regular \# regular, adaptive, compact  
  is\_transparent: false  
  height: 50px  
  width: 100%  
  color\_theme: dark \# dark, light  
  locale: en

### **Tickers**

\- type: custom:tradingview-widget-card  
  widget\_type: tickers  
  title: Popular Stocks  
  pairs:  
    \- NASDAQ:AAPL  
    \- NASDAQ:GOOGL  
    \- NASDAQ:MSFT  
  show\_symbol\_logo: true  
  height: 75px  
  width: 100%  
  color\_theme: light  
  locale: en  
  is\_transparent: false

### **Single Quote**

\- type: custom:tradingview-widget-card  
  widget\_type: single-quote  
  title: USD/TRY Pair  
  pairs:  
    \- OANDA:USDTRY  
  is\_transparent: false  
  height: 100px  
  width: 100%  
  color\_theme: dark  
  locale: en

### **Stock Heatmap**

\- type: custom:tradingview-widget-card  
  widget\_type: stock-heatmap  
  title: US Stock Heatmap  
  data\_source: SPX500 \# Examples: SPX500, NASDAQ, DowJones  
  height: 500px  
  width: 100%  
  exchange: ""  
  grouping: sector  
  block\_size: market\_cap\_basic  
  block\_color: change  
  has\_top\_bar: false  
  is\_zoom\_enabled: true  
  has\_symbol\_tooltip: true  
  is\_data\_set\_enabled: false  
  is\_mono\_size: true  
  color\_theme: dark  
  locale: en

### **ETF Heatmap**

\- type: custom:tradingview-widget-card  
  widget\_type: etf-heatmap  
  title: Global ETF Heatmap  
  data\_source: AllUSEtf \# AllUSEtf, AllAUEtf, etc.  
  height: 500px  
  grouping: asset\_class \# asset\_class, no\_group  
  block\_size: volume \# volume, Value.Traded, monoSize  
  block\_color: change \# change, Perf.W, Perf.1M, etc.  
  has\_top\_bar: false  
  is\_zoom\_enabled: true  
  has\_symbol\_tooltip: true  
  is\_data\_set\_enabled: false  
  is\_mono\_size: false  
  locale: en  
  color\_theme: dark  
  width: 100%

### **Forex Cross Rates**

\- type: custom:tradingview-widget-card  
  widget\_type: forex-cross-rates  
  title: Forex Cross Rates  
  currencies:  
    \- EUR  
    \- USD  
    \- GBP  
    \- JPY  
    \- CHF  
    \- CAD  
    \- TRY  
  color\_theme: dark  
  locale: en  
  background\_color: "\#000000"  
  width: 100%  
  height: 500px

### **Forex Heatmap**

\- type: custom:tradingview-widget-card  
  widget\_type: forex-heat-map  
  title: Forex Heatmap  
  currencies:  
    \- EUR  
    \- USD  
    \- JPY  
    \- GBP  
    \- CHF  
    \- AUD  
    \- CAD  
  color\_theme: dark  
  locale: en  
  is\_transparent: false  
  background\_color: "\#000000"  
  width: 100%  
  height: 300px

### **Technical Analysis**

\- type: custom:tradingview-widget-card  
  widget\_type: technical-analysis  
  title: BTC/USDT Technical Analysis  
  pairs:  
    \- BINANCE:BTCUSDT  
  interval: 1D \# 1m, 5m, 15m, 1H, 4H, 1D, 1W, 1M  
  height: 100%  
  width: 100%  
  show\_interval\_tabs: true  
  is\_transparent: false  
  display\_mode: single  
  locale: en  
  color\_theme: dark

### **Economic Calendar**

\- type: custom:tradingview-widget-card  
  widget\_type: economic-calendar  
  title: Economic Calendar  
  height: 450px  
  country\_filter: us,eu,tr  
  importance\_filter: \-1,0,1  
  color\_theme: dark  
  locale: en  
  width: 100%  
  is\_transparent: false

### **News**

\- type: custom:tradingview-widget-card  
  widget\_type: news  
  title: Market News  
  display\_mode: adaptive \# adaptive, regular, compact  
  feed\_mode: all\_symbols \# all\_symbols, symbol, market  
  \# If feed\_mode is 'symbol', use the line below:  
  \# symbol: NASDAQ:AAPL  
  \# If feed\_mode is 'market', use the line below:  
  \# market: crypto \# crypto, forex, stock, index, futures, cfd  
  height: 450px  
  color\_theme: dark  
  locale: en  
  width: 100%  
  is\_transparent: false

### **Market Overview Watchlist**

type: custom:tradingview-widget-card  
widget\_type: market-overview  
title: ""  
height: 550px  
width: 100%  
color\_theme: dark  
locale: en  
date\_range: 12M  
show\_chart: true  
show\_floating\_tooltip: true  
is\_transparent: false  
tab\_config: |-  
  Crypto:  
   \- BINANCE:BTCUSDT  
   \- BINANCE:ETHUSDT  
  Stock:  
   \- NASDAQ:AAPL  
   \- NASDAQ:TSLA  
  Indices:  
  \- INDEX:NKY

### **Stock Market Hotlist**

type: custom:tradingview-widget-card  
widget\_type: stock-market-hotlists  
title: ""  
height: 550px  
width: 100%  
exchange: US Exchanges  
date\_range: 12M  
show\_chart: true  
show\_floating\_tooltip: true  
is\_transparent: false  
color\_theme: dark  
locale: en

### **Market Quotes**

type: custom:tradingview-widget-card  
widget\_type: market-quotes  
title: ""  
height: 550px  
width: 100%  
show\_symbol\_logo: true  
is\_transparent: false  
color\_theme: dark  
locale: en  
tab\_config: |-  
  Indices:  
   \- FOREXCOM:SPXUSD  
   \- FOREXCOM:NSXUSD  
  Futures:  
   \- BMFBOVESPA:ISP1\!  
   \- CMCMARKETS:GOLD

## **⭐ Support**

If you like this card, feel free to ⭐ star the project on GitHub and share it with the Home Assistant community\!
