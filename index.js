// 引用 line 機器人套件
import linebot from 'linebot'
// 引用 dotenv 套件
import dotevn from 'dotenv'
// 引用 axios 套件
import axios from 'axios'
// 引用 node-schedule
import schedule from 'node-schedule'

// 古蹟
let HistoricSites = []

const updateData = async () => {
  const response = await axios.get('https://data.boch.gov.tw/data/opendata/v2/assetsCase/1.1.json')
  HistoricSites = response.data
}

// 歷史建築
let HistoricalBuildings = []

const updateData2 = async () => {
  const response = await axios.get('https://data.boch.gov.tw/data/opendata/v2/assetsCase/1.2.json')
  HistoricalBuildings = response.data
}

// 每天 0:00 更新
schedule.scheduleJob('* * 0 * * *', () => {
  updateData()
  updateData2()
})

updateData()
updateData2()

// 讀取 .env
dotevn.config()

// 設定機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// postion 經緯度 & 距離計算
const getMaxMinLongitudeLatitude = (longitude, latitude, distince) => {
  // console.log('MaxMinLongitudeLatitude', longitude, latitude)
  const r = 6371.393 // 地球半徑千米
  const lng = longitude
  const lat = latitude
  let dlng = 2 * Math.asin(Math.sin(distince / (2 * r)) / Math.cos(lat * Math.PI / 180))
  dlng = dlng * 180 / Math.PI // 角度轉為弧度
  let dlat = distince / r
  dlat = dlat * 180 / Math.PI
  const lat1 = lat - dlat
  const lat2 = lat + dlat
  const minlat = Math.min(lat1, lat2)
  const maxlat = Math.max(lat1, lat2)
  const lng1 = lng - dlng
  const lng2 = lng + dlng
  const minlng = Math.min(lng1, lng2)
  const maxlng = Math.max(lng1, lng2)
  return { minlng, maxlng, minlat, maxlat }
}

// 加入 - 發送使用說明
bot.on('follow', async event => {
  try {
    let reply = ''
    reply = {
      type: 'flex',
      altText: 'Flex',
      contents: {
        type: 'carousel',
        contents: [
          {
            type: 'bubble',
            hero: {
              type: 'image',
              url: 'https://i.imgur.com/pXBdhCI.png',
              size: 'full',
              aspectRatio: '3:2',
              aspectMode: 'cover',
              action: {
                type: 'uri',
                uri: 'http://linecorp.com/'
              }
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '歷古嚦咕 LI-GU',
                  weight: 'bold',
                  size: 'xl',
                  align: 'center'
                },
                {
                  type: 'text',
                  size: 'sm',
                  text: '歡迎加入 ❛歷古嚦咕 ❜  │ 使用說明',
                  align: 'center'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'lg',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'icon',
                          size: 'sm',
                          url: 'https://i.imgur.com/HFeV88n.png'
                        },
                        {
                          type: 'text',
                          text: '輸入關鍵字',
                          size: 'md',
                          flex: 1,
                          weight: 'bold'
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'text',
                          text: '直接輸入想要查詢的古蹟或歷史建築名稱，例如：「赤嵌樓」。',
                          wrap: true
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      margin: 'lg',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'box',
                          layout: 'baseline',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'icon',
                              size: 'sm',
                              url: 'https://i.imgur.com/0Ymtg9N.png'
                            },
                            {
                              type: 'text',
                              text: '輸入指令',
                              size: 'md',
                              flex: 1,
                              weight: 'bold'
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'text',
                              text: '@help',
                              margin: 'none',
                              decoration: 'none'
                            },
                            {
                              type: 'text',
                              text: '▸ 顯示此訊息。'
                            },
                            {
                              type: 'text',
                              text: '@hs + 關鍵字',
                              margin: 'md'
                            },
                            {
                              type: 'text',
                              text: '▸ 查詢背景含有關鍵字的古蹟。',
                              wrap: true
                            },
                            {
                              type: 'text',
                              text: '@hb + 關鍵字',
                              margin: 'md'
                            },
                            {
                              type: 'text',
                              text: '▸ 查詢背景含有關鍵字的歷史建築。',
                              wrap: true
                            }
                          ],
                          margin: 'sm'
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      margin: 'lg',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'box',
                          layout: 'baseline',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'icon',
                              size: 'sm',
                              url: 'https://i.imgur.com/62PSmkz.png'
                            },
                            {
                              type: 'text',
                              text: '發送位置訊息 ‒ 打卡',
                              size: 'md',
                              flex: 1,
                              weight: 'bold'
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'text',
                              text: '根據所在地或打卡位置查詢附近的古蹟。',
                              margin: 'none',
                              wrap: true
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          },
          {
            type: 'bubble',
            hero: {
              type: 'image',
              url: 'https://i.imgur.com/lJh23xe.png',
              size: 'full',
              aspectMode: 'cover',
              aspectRatio: '3:2'
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '歷古嚦咕 LI-GU',
                  weight: 'bold',
                  size: 'xl',
                  align: 'center'
                },
                {
                  type: 'text',
                  size: 'sm',
                  text: '常見問題 │ 𝐐 ＆ 𝐀',
                  align: 'center'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'lg',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'icon',
                          size: 'sm',
                          url: 'https://i.imgur.com/1fBK9ez.png'
                        },
                        {
                          type: 'text',
                          text: '找不到想要的資料？',
                          size: 'md',
                          flex: 1,
                          weight: 'bold'
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'text',
                          margin: 'xs',
                          text: '❶ 關鍵字的準確度： ',
                          wrap: true,
                          decoration: 'none'
                        },
                        {
                          type: 'text',
                          text: '舉例：輸入「孔子廟」會出現「彰化孔子廟」的訊息，若要查詢位於台南的孔廟，則必須輸入「臺南孔子廟」。',
                          wrap: true
                        },
                        {
                          type: 'text',
                          text: '❷ 關鍵字有無錯別字：',
                          margin: 'md',
                          decoration: 'none'
                        },
                        {
                          type: 'text',
                          text: '如：輸入「台中火車站」，會找不到符合的資料，輸入「臺中火車站」就能找到資料囉～',
                          wrap: true
                        },
                        {
                          type: 'text',
                          text: '❸ 指令格式是否正確：',
                          margin: 'md',
                          decoration: 'none'
                        },
                        {
                          type: 'text',
                          text: '指令的正確格式為「@指令（空格）關鍵字」，且有大小寫的區別，例：「@hs 清朝」。',
                          wrap: true
                        }
                      ],
                      margin: 'sm'
                    }
                  ]
                }
              ]
            }
          },
          {
            type: 'bubble',
            hero: {
              type: 'image',
              url: 'https://i.imgur.com/ti1XdWh.png',
              size: 'full',
              aspectMode: 'cover',
              aspectRatio: '3:2'
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '歷古嚦咕 LI-GU',
                  weight: 'bold',
                  size: 'xl',
                  align: 'center'
                },
                {
                  type: 'text',
                  size: 'sm',
                  text: '小小知識 │ 𝘋𝘰 𝘺𝘰𝘶 𝘬𝘯𝘰𝘸 ?',
                  align: 'center'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'lg',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'icon',
                          size: 'sm',
                          url: 'https://i.imgur.com/lkrT3of.png'
                        },
                        {
                          type: 'text',
                          text: '古蹟與歷史建築的差別是？',
                          size: 'md',
                          flex: 1,
                          weight: 'bold'
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'text',
                          margin: 'xs',
                          text: '兩者均指人類為生活需要所營建之具有歷史、文化價值之建造物及附屬設施群。但古蹟是強制性的保存，而歷史建築是獎勵性的保存。',
                          wrap: true,
                          decoration: 'none'
                        }
                      ],
                      margin: 'sm'
                    },
                    {
                      type: 'box',
                      layout: 'baseline',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'icon',
                          size: 'sm',
                          url: 'https://i.imgur.com/KKjsylK.png'
                        },
                        {
                          type: 'text',
                          text: '全國古蹟日在什麼時候？',
                          size: 'md',
                          flex: 1,
                          weight: 'bold'
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'text',
                          margin: 'xs',
                          text: '全國古蹟日訂於每年九月的第三個週末。緣起法國，目的在於提升民眾對文化豐富性和多樣性的認識，激發其對保護文化資產的興趣，並鼓勵文化包容。',
                          wrap: true,
                          decoration: 'none'
                        }
                      ],
                      margin: 'sm'
                    },
                    {
                      type: 'box',
                      layout: 'baseline',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'icon',
                          size: 'sm',
                          url: 'https://i.imgur.com/FHGolOM.png'
                        },
                        {
                          type: 'text',
                          text: '全台古蹟最多的城市是哪裡？',
                          size: 'md',
                          flex: 1,
                          weight: 'bold'
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'text',
                          margin: 'xs',
                          text: '你以為是臺南嗎？燈愣！是臺北。全台古蹟共 941 筆，其中臺北最多有 171 筆，其次為臺南 142 筆。',
                          wrap: true,
                          decoration: 'none'
                        }
                      ],
                      margin: 'sm'
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    }

    console.log('join')
    event.reply(reply)
  } catch (error) {
    event.reply('error')
    console.log(error)
  }
})

// 訊息回應
bot.on('message', async event => {
  try {
    let reply = ''

    const text = event.message.text
    // longitude 經度 / latitude 緯度 / distince 距離 (km)
    const latitude = event.message.latitude
    const longitude = event.message.longitude
    const position = getMaxMinLongitudeLatitude(longitude, latitude, 1)

    const flex = {
      type: 'flex',
      altText: 'Flex',
      contents: {
        type: 'carousel',
        contents: []
      }
    }

    // 輸入關鍵字，查詢背景等詳細資訊
    // 若名稱包含輸入的文字
    // 回應 (reply)：名稱 / 級別  / 歷史 /  地址
    if (event.message.type === 'text') {
      // HistoricSites 古蹟
      for (const data of HistoricSites) {
        if (data.caseName.includes(text)) {
          reply = {
            type: 'flex',
            altText: 'Flex',
            contents: {
              type: 'bubble',
              hero: {
                type: 'image',
                url: 'https://i.imgur.com/mL7e2v1.png',
                aspectRatio: '2:1',
                size: 'full',
                aspectMode: 'cover'
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: '古蹟',
                    weight: 'bold',
                    color: '#ED784A',
                    size: 'sm'
                  },
                  {
                    type: 'text',
                    text: data.caseName,
                    weight: 'bold',
                    size: 'lg',
                    margin: 'sm',
                    wrap: true
                  },
                  {
                    type: 'text',
                    text: data.assetsClassifyName,
                    size: 'xs',
                    color: '#aaaaaa',
                    wrap: true
                  },
                  {
                    type: 'text',
                    text: '📍' + data.belongCity + ' - ' + data.belongAddress,
                    size: 'xs',
                    color: '#000000',
                    wrap: true,
                    margin: 'none'
                  },
                  {
                    type: 'separator',
                    margin: 'md'
                  },
                  {
                    type: 'button',
                    action: {
                      type: 'uri',
                      label: '地圖',
                      uri: 'https://www.google.com/maps/search/' + data.latitude + ',' + data.longitude
                    },
                    height: 'sm',
                    style: 'primary',
                    color: '#ED784A'
                  },
                  {
                    type: 'separator',
                    margin: 'md'
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'xl',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'text',
                            text: '歷史背景',
                            size: 'sm',
                            color: '#555555',
                            flex: 0
                          },
                          {
                            type: 'text',
                            text: data.pastHistory,
                            size: 'sm',
                            color: '#111111',
                            align: 'start',
                            margin: 'sm',
                            wrap: true
                          }
                        ],
                        height: '100%'
                      }
                    ]
                  }
                ]
              },
              styles: {
                footer: {
                  separator: true
                }
              }
            }
          }
          break
        } else if (text.substring(0, 4) === '@hs ') {
          const relatedHS = text.slice(4)
          if (data.pastHistory.includes(relatedHS) || data.registerReason.includes(relatedHS)) {
            if (flex.contents.contents.length < 10) {
              flex.contents.contents.push({
                type: 'bubble',
                hero: {
                  type: 'image',
                  size: 'full',
                  aspectRatio: '2:1',
                  aspectMode: 'cover',
                  url: 'https://i.imgur.com/g9re7MO.png'
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'text',
                      text: '古蹟',
                      wrap: true,
                      weight: 'bold',
                      size: 'sm',
                      flex: 0,
                      margin: 'none',
                      color: '#d18063'
                    },
                    {
                      type: 'text',
                      text: data.caseName,
                      wrap: true,
                      weight: 'bold',
                      size: 'lg',
                      margin: 'sm'
                    },
                    {
                      type: 'text',
                      text: data.assetsClassifyName,
                      wrap: true,
                      weight: 'bold',
                      size: 'xs',
                      flex: 0,
                      margin: 'none',
                      color: '#aaaaaa'
                    },
                    {
                      type: 'text',
                      text: data.belongAddress,
                      wrap: true,
                      weight: 'regular',
                      size: 'xs',
                      flex: 0,
                      margin: 'md',
                      color: '#000000'
                    }
                  ]
                },
                footer: {
                  type: 'box',
                  layout: 'vertical',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'button',
                      style: 'primary',
                      action: {
                        type: 'uri',
                        label: '地圖',
                        uri: 'https://www.google.com/maps/search/' + data.latitude + ',' + data.longitude
                      },
                      color: '#d18063',
                      height: 'sm'
                    },
                    {
                      type: 'button',
                      action: {
                        type: 'message',
                        label: '詳細資訊',
                        text: data.caseName
                      }
                    }
                  ]
                }
              })
            }
            reply = flex
          }
        }
      }

      // HistoricalBuildings 歷史建築
      for (const data of HistoricalBuildings) {
        if (data.caseName.includes(text)) {
          reply = {
            type: 'flex',
            altText: 'Flex',
            contents: {
              type: 'bubble',
              hero: {
                type: 'image',
                url: 'https://i.imgur.com/0hYM0Ry.png',
                aspectRatio: '2:1',
                size: 'full',
                aspectMode: 'cover'
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: '歷史建築',
                    weight: 'bold',
                    color: '#837658',
                    size: 'sm'
                  },
                  {
                    type: 'text',
                    text: data.caseName,
                    weight: 'bold',
                    size: 'lg',
                    margin: 'sm',
                    wrap: true
                  },
                  {
                    type: 'text',
                    text: '📍' + data.belongCity + ' - ' + data.belongAddress,
                    size: 'xs',
                    color: '#000000',
                    wrap: true,
                    margin: 'md'
                  },
                  {
                    type: 'separator',
                    margin: 'md'
                  },
                  {
                    type: 'button',
                    action: {
                      type: 'uri',
                      label: '地圖',
                      uri: 'https://www.google.com/maps/search/' + data.latitude + ',' + data.longitude
                    },
                    height: 'sm',
                    style: 'primary',
                    color: '#837658'
                  },
                  {
                    type: 'separator',
                    margin: 'md'
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'xl',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'text',
                            text: '歷史背景',
                            size: 'sm',
                            color: '#555555',
                            flex: 0
                          },
                          {
                            type: 'text',
                            text: data.pastHistory,
                            size: 'sm',
                            color: '#111111',
                            align: 'start',
                            margin: 'sm',
                            wrap: true
                          }
                        ],
                        height: '100%'
                      }
                    ]
                  }
                ]
              },
              styles: {
                footer: {
                  separator: true
                }
              }
            }
          }
          break
        } else if (text.substring(0, 4) === '@hb ') {
          const relatedHB = text.slice(4)
          if (data.registerReason.includes(relatedHB)) {
            if (flex.contents.contents.length < 10) {
              flex.contents.contents.push({
                type: 'bubble',
                hero: {
                  type: 'image',
                  size: 'full',
                  aspectRatio: '2:1',
                  aspectMode: 'cover',
                  url: 'https://i.imgur.com/Zxhp6cm.png'
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'text',
                      text: '歷史建築',
                      wrap: true,
                      weight: 'bold',
                      size: 'sm',
                      flex: 0,
                      margin: 'none',
                      color: '#838A2D'
                    },
                    {
                      type: 'text',
                      text: data.caseName,
                      wrap: true,
                      weight: 'bold',
                      size: 'lg',
                      margin: 'sm'
                    },
                    {
                      type: 'text',
                      text: data.belongAddress,
                      wrap: true,
                      weight: 'regular',
                      size: 'xs',
                      flex: 0,
                      margin: 'md',
                      color: '#000000'
                    }
                  ]
                },
                footer: {
                  type: 'box',
                  layout: 'vertical',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'button',
                      style: 'primary',
                      action: {
                        type: 'uri',
                        label: '地圖',
                        uri: 'https://www.google.com/maps/search/' + data.latitude + ',' + data.longitude
                      },
                      color: '#838A2D',
                      height: 'sm'
                    },
                    {
                      type: 'button',
                      action: {
                        type: 'message',
                        label: '詳細資訊',
                        text: data.caseName
                      }
                    }
                  ]
                }
              }
              )
            }
            reply = flex
          }
        }
      }

      // @help
      if (text === '@help') {
        reply = {
          type: 'flex',
          altText: 'Flex',
          contents: {
            type: 'carousel',
            contents: [
              {
                type: 'bubble',
                hero: {
                  type: 'image',
                  url: 'https://i.imgur.com/pXBdhCI.png',
                  size: 'full',
                  aspectRatio: '3:2',
                  aspectMode: 'cover',
                  action: {
                    type: 'uri',
                    uri: 'http://linecorp.com/'
                  }
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: '歷古嚦咕 LI-GU',
                      weight: 'bold',
                      size: 'xl',
                      align: 'center'
                    },
                    {
                      type: 'text',
                      size: 'sm',
                      text: '歡迎加入 ❛歷古嚦咕 ❜  │ 使用說明',
                      align: 'center'
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      margin: 'lg',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'box',
                          layout: 'baseline',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'icon',
                              size: 'sm',
                              url: 'https://i.imgur.com/HFeV88n.png'
                            },
                            {
                              type: 'text',
                              text: '輸入關鍵字',
                              size: 'md',
                              flex: 1,
                              weight: 'bold'
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'text',
                              text: '直接輸入想要查詢的古蹟或歷史建築名稱，例如：「赤嵌樓」。',
                              wrap: true
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'vertical',
                          margin: 'lg',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'box',
                              layout: 'baseline',
                              spacing: 'sm',
                              contents: [
                                {
                                  type: 'icon',
                                  size: 'sm',
                                  url: 'https://i.imgur.com/0Ymtg9N.png'
                                },
                                {
                                  type: 'text',
                                  text: '輸入指令',
                                  size: 'md',
                                  flex: 1,
                                  weight: 'bold'
                                }
                              ]
                            },
                            {
                              type: 'box',
                              layout: 'vertical',
                              contents: [
                                {
                                  type: 'text',
                                  text: '@help',
                                  margin: 'none',
                                  decoration: 'none'
                                },
                                {
                                  type: 'text',
                                  text: '▸ 顯示此訊息。'
                                },
                                {
                                  type: 'text',
                                  text: '@hs + 關鍵字',
                                  margin: 'md'
                                },
                                {
                                  type: 'text',
                                  text: '▸ 查詢背景含有關鍵字的古蹟。',
                                  wrap: true
                                },
                                {
                                  type: 'text',
                                  text: '@hb + 關鍵字',
                                  margin: 'md'
                                },
                                {
                                  type: 'text',
                                  text: '▸ 查詢背景含有關鍵字的歷史建築。',
                                  wrap: true
                                }
                              ],
                              margin: 'sm'
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'vertical',
                          margin: 'lg',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'box',
                              layout: 'baseline',
                              spacing: 'sm',
                              contents: [
                                {
                                  type: 'icon',
                                  size: 'sm',
                                  url: 'https://i.imgur.com/62PSmkz.png'
                                },
                                {
                                  type: 'text',
                                  text: '發送位置訊息 ‒ 打卡',
                                  size: 'md',
                                  flex: 1,
                                  weight: 'bold'
                                }
                              ]
                            },
                            {
                              type: 'box',
                              layout: 'vertical',
                              contents: [
                                {
                                  type: 'text',
                                  text: '根據所在地或打卡位置查詢附近的古蹟。',
                                  margin: 'none',
                                  wrap: true
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              },
              {
                type: 'bubble',
                hero: {
                  type: 'image',
                  url: 'https://i.imgur.com/lJh23xe.png',
                  size: 'full',
                  aspectMode: 'cover',
                  aspectRatio: '3:2'
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: '歷古嚦咕 LI-GU',
                      weight: 'bold',
                      size: 'xl',
                      align: 'center'
                    },
                    {
                      type: 'text',
                      size: 'sm',
                      text: '常見問題 │ 𝐐 ＆ 𝐀',
                      align: 'center'
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      margin: 'lg',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'box',
                          layout: 'baseline',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'icon',
                              size: 'sm',
                              url: 'https://i.imgur.com/1fBK9ez.png'
                            },
                            {
                              type: 'text',
                              text: '找不到想要的資料？',
                              size: 'md',
                              flex: 1,
                              weight: 'bold'
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'text',
                              margin: 'xs',
                              text: '❶ 關鍵字的準確度： ',
                              wrap: true,
                              decoration: 'none'
                            },
                            {
                              type: 'text',
                              text: '舉例：輸入「孔子廟」會出現「彰化孔子廟」的訊息，若要查詢位於台南的孔廟，則必須輸入「臺南孔子廟」。',
                              wrap: true
                            },
                            {
                              type: 'text',
                              text: '❷ 關鍵字有無錯別字：',
                              margin: 'md',
                              decoration: 'none'
                            },
                            {
                              type: 'text',
                              text: '如：輸入「台中火車站」，會找不到符合的資料，輸入「臺中火車站」就能找到資料囉～',
                              wrap: true
                            },
                            {
                              type: 'text',
                              text: '❸ 指令格式是否正確：',
                              margin: 'md',
                              decoration: 'none'
                            },
                            {
                              type: 'text',
                              text: '指令的正確格式為「@指令（空格）關鍵字」，且有大小寫的區別，例：「@hs 清朝」。',
                              wrap: true
                            }
                          ],
                          margin: 'sm'
                        }
                      ]
                    }
                  ]
                }
              },
              {
                type: 'bubble',
                hero: {
                  type: 'image',
                  url: 'https://i.imgur.com/ti1XdWh.png',
                  size: 'full',
                  aspectMode: 'cover',
                  aspectRatio: '3:2'
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: '歷古嚦咕 LI-GU',
                      weight: 'bold',
                      size: 'xl',
                      align: 'center'
                    },
                    {
                      type: 'text',
                      size: 'sm',
                      text: '小小知識 │ 𝘋𝘰 𝘺𝘰𝘶 𝘬𝘯𝘰𝘸 ?',
                      align: 'center'
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      margin: 'lg',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'box',
                          layout: 'baseline',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'icon',
                              size: 'sm',
                              url: 'https://i.imgur.com/lkrT3of.png'
                            },
                            {
                              type: 'text',
                              text: '古蹟與歷史建築的差別是？',
                              size: 'md',
                              flex: 1,
                              weight: 'bold'
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'text',
                              margin: 'xs',
                              text: '兩者均指人類為生活需要所營建之具有歷史、文化價值之建造物及附屬設施群。但古蹟是強制性的保存，而歷史建築是獎勵性的保存。',
                              wrap: true,
                              decoration: 'none'
                            }
                          ],
                          margin: 'sm'
                        },
                        {
                          type: 'box',
                          layout: 'baseline',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'icon',
                              size: 'sm',
                              url: 'https://i.imgur.com/KKjsylK.png'
                            },
                            {
                              type: 'text',
                              text: '全國古蹟日在什麼時候？',
                              size: 'md',
                              flex: 1,
                              weight: 'bold'
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'text',
                              margin: 'xs',
                              text: '全國古蹟日訂於每年九月的第三個週末。緣起法國，目的在於提升民眾對文化豐富性和多樣性的認識，激發其對保護文化資產的興趣，並鼓勵文化包容。',
                              wrap: true,
                              decoration: 'none'
                            }
                          ],
                          margin: 'sm'
                        },
                        {
                          type: 'box',
                          layout: 'baseline',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'icon',
                              size: 'sm',
                              url: 'https://i.imgur.com/FHGolOM.png'
                            },
                            {
                              type: 'text',
                              text: '全台古蹟最多的城市是哪裡？',
                              size: 'md',
                              flex: 1,
                              weight: 'bold'
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'text',
                              margin: 'xs',
                              text: '你以為是臺南嗎？燈愣！是臺北。全台古蹟共 941 筆，其中臺北最多有 171 筆，其次為臺南 142 筆。',
                              wrap: true,
                              decoration: 'none'
                            }
                          ],
                          margin: 'sm'
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    }

    // 打卡，查詢附近的古蹟
    if (event.message.type === 'location') {
      for (const data of HistoricSites) {
        if (data.latitude >= position.minlat && data.latitude <= position.maxlat &&
          data.longitude >= position.minlng && data.longitude <= position.maxlng) {
          if (flex.contents.contents.length < 10) {
            flex.contents.contents.push({
              type: 'bubble',
              hero: {
                type: 'image',
                size: 'full',
                aspectRatio: '2:1',
                aspectMode: 'cover',
                url: 'https://i.imgur.com/YiM4GVe.png'
              },
              body: {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: '古蹟',
                    wrap: true,
                    weight: 'bold',
                    size: 'sm',
                    flex: 0,
                    margin: 'none',
                    color: '#F4B46A'
                  },
                  {
                    type: 'text',
                    text: data.caseName,
                    wrap: true,
                    weight: 'bold',
                    size: 'lg',
                    margin: 'sm'
                  },
                  {
                    type: 'text',
                    text: data.assetsClassifyName,
                    wrap: true,
                    weight: 'bold',
                    size: 'xs',
                    flex: 0,
                    margin: 'none',
                    color: '#aaaaaa'
                  },
                  {
                    type: 'text',
                    text: data.belongAddress,
                    wrap: true,
                    weight: 'regular',
                    size: 'xs',
                    flex: 0,
                    margin: 'md',
                    color: '#000000'
                  }
                ]
              },
              footer: {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                  {
                    type: 'button',
                    style: 'primary',
                    action: {
                      type: 'uri',
                      label: '地圖',
                      uri: 'https://www.google.com/maps/search/' + data.latitude + ',' + data.longitude
                    },
                    color: '#F4B46A',
                    height: 'sm'
                  },
                  {
                    type: 'button',
                    action: {
                      type: 'message',
                      label: '詳細資訊',
                      text: data.caseName
                    }
                  }
                ]
              }
            }
            )
          }
        }
      }
      reply = flex
    }

    reply = (reply.length === 0) ? '很抱歉，找不到符合的資料 😢 \n請確認輸入的關鍵字或指令是否有誤。' : reply
    event.reply(reply)
  } catch (error) {
    event.reply('error')
    console.log(error)
  }
})

bot.listen('/', process.env.PORT, () => {
  console.log('Bot is ready!')
})
