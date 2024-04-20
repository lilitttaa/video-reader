import { ApexOptions } from 'apexcharts'

const toReadableDuration = (duration: number) => {
  let isNegative = false
  if (duration < 0) {
    isNegative = true
    duration = - duration
  }
  const seconds = duration
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24

  if (days >= 1) {
    return isNegative ? `${-days.toFixed(2)} days` : `${days.toFixed(2)} days`
  } else if (hours >= 1) {
    return isNegative ? `${-hours.toFixed(2)} hr` : `${hours.toFixed(2)} hr`
  } else if (minutes >= 1) {
    return isNegative
      ? `${-minutes.toFixed(2)} min`
      : `${minutes.toFixed(2)} min`
  } else {
    return isNegative
      ? `${-seconds.toFixed(2)} sec`
      : `${seconds.toFixed(2)} sec`
  }
}

const toReadableQuantity = (quantity: number) => {
  let isNegative = false
  if (quantity < 0) {
    isNegative = true
    quantity = -quantity
  }
  let readbleQuantity = ''
  if (quantity >= 1e6) {
    readbleQuantity = `${(quantity / 1e6).toFixed(2)}M`
  } else if (quantity >= 1e3) {
    readbleQuantity = `${(quantity / 1e3).toFixed(2)}K`
  } else {
    readbleQuantity = quantity.toString()
  }
  return isNegative ? `-${readbleQuantity}` : `+${readbleQuantity}`
}

const toReadbleRate = (rate: number) => {
  let isNegative = false
  if (rate < 0) {
    isNegative = true
    rate = -rate
  }
  return isNegative ? `-${rate.toFixed(2)}%` : `+${rate.toFixed(2)}%`
}

export const generateSectorDiagramOptions = (
  passColor: string,
  failColor: string
) => {
  return {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut'
    },
    colors: [passColor, failColor],
    labels: ['Pass', 'Fail'],
    legend: {
      show: false,
      position: 'bottom'
    },

    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent'
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380
          }
        }
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200
          }
        }
      }
    ]
  } as ApexOptions
}

export const generateSectorDiagramSeries = (failRate: number) => {
  console.log('failRate', failRate)
  return [100 - failRate * 100, failRate * 100]
}

export const generateBarOptions = (color: string, typeNames: string[]) => {
  return {
    colors: [color],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      stacked: false,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },

    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: '25%'
            }
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last'
      }
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    xaxis: {
      categories: typeNames
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px'
        }
      },
      min: 0,
      max: 1,
      stepSize: 0.1,
      decimalsInFloat: 2
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',

      markers: {
        radius: 99
      }
    },
    fill: {
      opacity: 1
    }
  } as ApexOptions
}

export const generateBarSeries = (typeErrorRates: number[]) => {
  return [
    {
      data: typeErrorRates
    }
  ]
}

export const generateBrokenLineOptions = (
  color: string,
  dateTimes: string[]
) => {
  return {
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'left'
    },
    colors: [color],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1
      },

      toolbar: {
        show: false
      }
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300
          }
        }
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350
          }
        }
      }
    ],
    stroke: {
      width: [2, 2],
      curve: 'smooth'
    },
    // labels: {
    //   show: false,
    //   position: "top",
    // },
    grid: {
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: [color],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5
      }
    },
    xaxis: {
      type: 'category',
      categories: dateTimes,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px'
        }
      },
      min: 0,
      max: 1,
      stepSize: 0.1,
      decimalsInFloat: 2
    }
  } as ApexOptions
}

export const generateBrokenLineSeries = (failRates: number[]) => {
  return [
    {
      name: 'Fail Rate',
      data: failRates
    }
  ]
}

export class CardInfo {
  total: string
  title: string
  delta: string
  levelUp?: boolean
  color?: cardColor
  bgColor:string
  constructor (
    total: string,
    title: string,
    delta: string,
    bgColor:string,
    levelUp?: boolean,
    color?: cardColor,
  ) {
    this.total = total
    this.title = title
    this.delta = delta
    this.levelUp = levelUp
    this.color = color
    this.bgColor = bgColor
  }
}
type cardColor = 'success' | 'error'

class ReadableTableRowInfo {
  startTime: string
  totalQuantity: string
  errorRate: string
  errorQuantity: string
  duration: string
  constructor (
    startTime: string,
    totalQuntity: string,
    errorRate: string,
    errorCount: string,
    duration: string
  ) {
    this.startTime = startTime
    this.totalQuantity = totalQuntity
    this.errorRate = errorRate
    this.errorQuantity = errorCount
    this.duration = duration
  }
}

export type validationTypeMap = {
  [key: string]: {
    count: number
    failed: number
  }
}

export type errorInfo = {
  assetPath: string
  errorMessage: string
  revision: string
  author: string
}

export class ValidationData {
  startTime: string
  duration: number
  typeMap: validationTypeMap
  errorInfos: errorInfo[]

  constructor (
    startTime: string,
    duration: number,
    typeMap: validationTypeMap,
    errorInfos: errorInfo[]
  ) {
    this.startTime = startTime
    this.duration = duration
    this.typeMap = typeMap
    this.errorInfos = errorInfos
  }

  calculateTotalQuantity () {
    let total = 0
    for (const key in this.typeMap) {
      total += this.typeMap[key].count
    }
    return total
  }
  calculateTotalFailed () {
    let total = 0
    for (const key in this.typeMap) {
      total += this.typeMap[key].failed
    }
    return total
  }
  calculateErrorRate () {
    return this.calculateTotalFailed() / this.calculateTotalQuantity()
  }

  calculateErrorRatePercent(){
    return this.calculateErrorRate() * 100;
  }

  calculateTypeErrorRate(typeName:string){
    const type = this.typeMap[typeName]
    if(!type){
      throw new Error('Failed to find type: ' + typeName)
    }
    return type.failed / type.count
  }

  calculateTypeErrorRatePercent(typeName:string){
    return this.calculateTypeErrorRate(typeName) * 100;
  }

  getDuration () {
    return this.duration
  }
  generateTableRowInfo () {
    return new ReadableTableRowInfo(
      this.startTime,
      this.calculateTotalQuantity().toString(),
      this.calculateErrorRatePercent().toFixed(2) + '%',
      this.calculateTotalFailed().toString(),
      toReadableDuration(this.getDuration())
    )
  }
  getTypeNames () {
    let typeNames = []
    for (const key in this.typeMap) {
      if (typeof this.typeMap[key] === 'object') {
        typeNames.push(key)
      }
    }
    return typeNames
  }
  getTypeErrorRates () {
    let typeErrorRates = []
    for (const key in this.typeMap) {
      if (typeof this.typeMap[key] === 'object') {
        typeErrorRates.push(this.typeMap[key].failed / this.typeMap[key].count)
      }
    }
    return typeErrorRates
  }

  generateErrorInfoByAuthor () {
    let errorInfosByAuthor: {
      [key: string]: errorInfo[]
    } = {}
    for (const error of this.errorInfos) {
      if (errorInfosByAuthor[error.author] === undefined) {
        errorInfosByAuthor[error.author] = []
      }
      errorInfosByAuthor[error.author].push(error)
    }
    const sortedAuthors = Object.keys(errorInfosByAuthor).sort()
    let sortedErrorInfosByAuthor: {
      [key: string]: errorInfo[]
    } = {}
    for (const author of sortedAuthors) {
      sortedErrorInfosByAuthor[author] = errorInfosByAuthor[author]
    }
    return sortedErrorInfosByAuthor
  }
}

interface Block {
  type:'header' | 'paragraph'
}

export class HeaderBlock implements Block {
  text: string
  level: number
  type: 'header' = 'header'
  constructor(text:string, level:number){
    this.text = text
    this.level = level
  }
}

export class ParagraphBlock implements Block {
  text: string
  isStrong: boolean
  type: 'paragraph' = 'paragraph'
  constructor(text: string, isStrong: boolean) {
    this.text = text
    this.isStrong = isStrong
  }
}

export class ValidationResult {
  recentData: ValidationData[]
  constructor (recentData: ValidationData[]) {
    this.recentData = recentData
  }

  private getNewestData () {
    return this.recentData[0]
  }

  private getLastData () {
    return this.recentData[1]
  }

  public hasData () {
    return this.recentData.length > 0
  }

  private hasHistoryData () {
    return this.recentData.length > 1
  }

  public calculateTotalQuantityCardInfo () {
    const bgClor = '#E3F5FF'
    if (!this.hasData()) {
      return new CardInfo('0', '数量', '0%', bgClor)
    } else if (!this.hasHistoryData()) {
      return new CardInfo(
        this.getNewestData().calculateTotalQuantity().toString(),
        '数量',
        '0%',
        bgClor
      )
    } else {
      const last = this.getLastData().calculateTotalQuantity()
      const current = this.getNewestData().calculateTotalQuantity()
      const levelUp = current > last
      return new CardInfo(
        current.toString(),
        '数量',
        toReadableQuantity(current - last),
        bgClor,
        levelUp,
        levelUp ? 'success' : 'error'
      )
    }
  }

  public calculateErrorRateCardInfo () {
    const bgClor = '#E5ECF6'
    if (!this.hasData()) {
      return new CardInfo('0', '错误率', '0%', bgClor)
    } else if (!this.hasHistoryData()) {
      return new CardInfo(this.getNewestData().calculateErrorRatePercent().toFixed(2), '错误率', '0%', bgClor)
    } else {
      const last = this.getLastData().calculateErrorRatePercent()
      const current = this.getNewestData().calculateErrorRatePercent()
      const levelUp = current > last
      return new CardInfo(current.toFixed(2), '错误率', toReadbleRate(current - last), bgClor,levelUp,levelUp ? 'error' : 'success')
    }
  }

  public calculateErrorQuantityCardInfo () {
    const bgClor = '#E3F5FF'
    if (!this.hasData()) {
      return new CardInfo('0', '错误数量', '0%',bgClor)
    } else if (!this.hasHistoryData()) {
      return new CardInfo(
        this.getNewestData().calculateTotalFailed().toString(),
        '错误数量',
        '0%',
        bgClor
      )
    } else {
      const last = this.getLastData().calculateTotalFailed()
      const current = this.getNewestData().calculateTotalFailed()
      const levelUp = current > last
      return new CardInfo(
        current.toString(),
        '错误数量',
        toReadableQuantity(current - last),
        bgClor,
        levelUp,
        levelUp ? 'error' : 'success'
      )
    }
  }
  public calculateDurationCardInfo () {
    const bgClor = '#E5ECF6'
    if (!this.hasData()) {
      return new CardInfo('0', '时长', '0%',bgClor)
    } else if (!this.hasHistoryData()) {
      return new CardInfo(
        toReadableDuration(this.getNewestData().getDuration()),
        '时长',
        '0%',
        bgClor
      )
    } else {
      const last = this.getLastData().getDuration()
      const current = this.getNewestData().getDuration()
      const levelUp = current > last
      return new CardInfo(
        toReadableDuration(current),
        '时长',
        toReadableDuration(current - last),
        bgClor,
        levelUp,
        levelUp ? 'error' : 'success'
      )
    }
  }
  public getNewestErrorRate () {
    return this.getNewestData().calculateErrorRate()
  }
  public getNewestIsSuccess () {
    return this.getNewestData().calculateErrorRate() === 0
  }

  public getNewestStartTime () {
    return this.getNewestData().startTime
  }

  public generateTableInfos () {
    return this.recentData.map(data => data.generateTableRowInfo())
  }

  public getAllErrorRate (reverse: boolean) {
    if (reverse) {
      return this.recentData.map(data => data.calculateErrorRate()).reverse()
    }
    return this.recentData.map(data => data.calculateErrorRate())
  }

  public getAllStartTimes (reverse: boolean) {
    if (reverse) {
      return this.recentData.map(data => data.startTime).reverse()
    }
    return this.recentData.map(data => data.startTime)
  }

  public getNewestTypeNames () {
    return this.getNewestData().getTypeNames()
  }

  public getNewestTypeErrorRates () {
    return this.getNewestData().getTypeErrorRates()
  }
  public generateMarkdown () {
    let markdown = `# 校验结果\n`
    markdown += `## 总体情况\n`
    markdown += `### 数量\n`
    markdown += `当前校验周期内，共校验了${this.getNewestData().calculateTotalQuantity()}个数据，`
    markdown += `其中有${this.getNewestData().calculateTotalFailed()}个数据校验失败，`
    markdown += `错误率为${this.getNewestData()
      .calculateErrorRatePercent()
      .toFixed(2)}%。\n`
    markdown += `### 时长\n`
    markdown += `本次校验持续了${toReadableDuration(
      this.getNewestData().getDuration()
    )}。\n`
    markdown += `## 详细情况\n`
    markdown += `### 错误类型\n`
    for (const key in this.getNewestData().typeMap) {
      markdown += `#### ${key}\n`
      markdown += `本次校验共校验了${
        this.getNewestData().typeMap[key].count
      }个${key}，`
      markdown += `其中有${
        this.getNewestData().typeMap[key].failed
      }个校验失败，`
      markdown += `错误率为${(
        this.getNewestData().typeMap[key].failed /
        this.getNewestData().typeMap[key].count
      ).toFixed(2)}%。\n`
    }
    markdown += `## 错误信息\n`
    const errorInfosByAuthor = this.getNewestData().generateErrorInfoByAuthor()
    for (const author in errorInfosByAuthor) {
      markdown += `### ${author}\n`
      for (const error of errorInfosByAuthor[author]) {
        markdown += `**${error.assetPath}**\n`
        markdown += `${error.errorMessage}\n`
        markdown += `提交版本:${error.revision}\n`
      }
    }
    return markdown
  }
  public generateBlocks() {
    let blocks:Block[] = []
    blocks.push(new HeaderBlock('校验结果', 1))
    blocks.push(new HeaderBlock('总体情况', 2))
    blocks.push(new HeaderBlock('数量', 3))
    blocks.push(new ParagraphBlock(`当前校验周期内，共校验了${this.getNewestData().calculateTotalQuantity()}个数据，其中有${this.getNewestData().calculateTotalFailed()}个数据校验失败，错误率为${this.getNewestData().calculateErrorRatePercent().toFixed(2)}%。`, false))
    blocks.push(new HeaderBlock('时长', 3))
    blocks.push(new ParagraphBlock(`本次校验持续了${toReadableDuration(this.getNewestData().getDuration())}。`, false))
    blocks.push(new HeaderBlock('详细情况', 2))
    blocks.push(new HeaderBlock('错误类型', 3))
    for (const key in this.getNewestData().typeMap) {
      blocks.push(new HeaderBlock(key, 4))
      blocks.push(new ParagraphBlock(`本次校验共校验了${this.getNewestData().typeMap[key].count}个${key}，其中有${this.getNewestData().typeMap[key].failed}个校验失败，错误率为${this.getNewestData().calculateTypeErrorRatePercent(key).toFixed(2)}%。`, false))
    }
    blocks.push(new HeaderBlock('错误信息', 2))
    const errorInfosByAuthor = this.getNewestData().generateErrorInfoByAuthor()
    for (const author in errorInfosByAuthor) {
      blocks.push(new HeaderBlock(author, 3))
      for (const error of errorInfosByAuthor[author]) {
        blocks.push(new ParagraphBlock(error.assetPath, true))
        blocks.push(new ParagraphBlock(error.errorMessage, false))
        blocks.push(new ParagraphBlock(`提交版本:${error.revision}`, false))
      }
    }
    return blocks
  }
  public generateHtml() {
    let html = `<h1>校验结果</h1>`
    html += `<h2>总体情况</h2>`
    html += `<h3>数量</h3>`
    html += `<p>当前校验周期内，共校验了${this.getNewestData().calculateTotalQuantity()}个数据，`
    html += `其中有${this.getNewestData().calculateTotalFailed()}个数据校验失败，`
    html += `错误率为${this.getNewestData()
      .calculateErrorRatePercent()
      .toFixed(2)}%。</p>`
    html += `<h3>时长</h3>`
    html += `<p>本次校验持续了${toReadableDuration(
      this.getNewestData().getDuration()
    )}。</p>`
    html += `<h2>详细情况</h2>`
    html += `<h3>错误类型</h3>`
    for (const key in this.getNewestData().typeMap) {
      html += `<h4>${key}</h4>`
      html += `<p>本次校验共校验了${
        this.getNewestData().typeMap[key].count
      }个${key}，`
      html += `其中有${this.getNewestData().typeMap[key].failed}个校验失败，`
      html += `错误率为${this.getNewestData().calculateTypeErrorRatePercent(key).toFixed(2)}%。</p>`
    }
    html += `<h2>错误信息</h2>`
    const errorInfosByAuthor = this.getNewestData().generateErrorInfoByAuthor()
    for (const author in errorInfosByAuthor) {
      html += `<h3>${author}</h3>`
      for (const error of errorInfosByAuthor[author]) {
        html += `<p><strong>${error.assetPath}</strong></p>`
        html += `<p>${error.errorMessage}</p>`
        html += `<p>提交版本:${error.revision}</p>`
      }
    }
    return html
  }
}

export const createValidationResult = (data: any) => {
  const validationData = data.records.map((record: any) => {
    const startTime = record.start_time
    const duration = record.duration
    const status = record.status
    let typeMap: validationTypeMap = {}
    for (const assetType in record.statistic_info) {
      let typeRecord = record.statistic_info[assetType]
      if (typeof typeRecord === 'object') {
        typeMap[assetType] = {
          count: typeRecord.Count,
          failed: typeRecord.InvalidCount
        }
      }
    }
    let errorInfos = []
    for (const error of record.error_infos) {
      errorInfos.push({
        assetPath: error.asset_path,
        errorMessage: error.error_message,
        revision: error.latest_commit_info.revision,
        author: error.latest_commit_info.author
      } as errorInfo)
    }
    return new ValidationData(startTime, duration, typeMap, errorInfos)

    // record.statistic_info.

    // return new ValidationData(startTime, duration, typeMap)
  })
  return new ValidationResult(validationData)
}
