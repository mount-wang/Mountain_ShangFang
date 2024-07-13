import 'ol/ol.css'
import * as control from 'ol/control'
import { Feature, Map, View, Overlay } from 'ol'
import TileLayer from 'ol/layer/Tile'
import FullScreen from 'ol/control/FullScreen'
import XYZ from 'ol/source/XYZ'
import { Control } from 'ol/control'
import { Point } from 'ol/geom'
import { fromLonLat, transformExtent } from 'ol/proj'
import { defaults as defaultInteractions, DragPan } from 'ol/interaction'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Circle as CircleStyle, Style, Icon, Stroke, Fill } from 'ol/style';

const defaultZoom = 14
const defaultCenter = [115.8252, 39.673]
const defaultRotation = 0
const defaultExtent = transformExtent([115.79, 39.66, 115.84, 39.685], 'EPSG:4326', 'EPSG:3857')

export class RotateNorthControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {}
    const button = document.createElement('button')
    button.innerHTML = '↻'
    const element = document.createElement('div')
    element.className = 'rotate-north ol-unselectable ol-control'
    element.appendChild(button)
    super({ element: element, target: options.target })
    button.addEventListener('click', this.handleRotateNorth.bind(this), false)
  }
  handleRotateNorth() {
    const map = this.getMap()
    if (map) {
      const view = map.getView()
      view.setRotation(defaultRotation)
      view.setCenter(fromLonLat(defaultCenter))
      view.setZoom(defaultZoom)
    }
  }
}

export function initMap() {
  const map = new Map({
    target: 'ShangFang-Mountain',
    controls: control.defaults({ attribution: true, zoom: true, rotate: true }).extend([new FullScreen()]),
    view: new View({
      extent: defaultExtent,
      center: fromLonLat(defaultCenter),
      maxZoom: 18,
      zoom: defaultZoom,
      minZoom: 12,
      rotation: defaultRotation,
      projection: 'EPSG:3857'
    }),
    interactions: defaultInteractions().extend([
      new DragPan({ condition: function () { return false; } })
    ])
  })

  const xyzLayer = new TileLayer({
    source: new XYZ({
      url: 'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=9c7ec345f02059c7ef160e017d59c010'
    })
  })
  map.addLayer(xyzLayer)

  const overviewMap = new control.OverviewMap({
    className: 'ol-overviewmap ol-custom-overviewmap',
    collapsed: false,
    collapseLabel: '\u00BB',
    label: '\u00AB',
    rotateWithView: false,
    tipLabel: 'Overview map',
    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=9c7ec345f02059c7ef160e017d59c010'
        })
      })
    ]
  })
  map.addControl(overviewMap)
  // 添加样式和边框颜色
  const borderStyle = new Style({
    stroke: new Stroke({
      color: 'red',
      width: 2
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.3)'
    })
  });
  // 定义函数来设置边框样式
  function setBorderStyle(collapsed) {
    const element = document.querySelector('.ol-overviewmap');
    if (element) {
      if (collapsed) {
        element.style.border = 'none';  // 收起时没有边框
      } else {
        element.style.border = '2px solid red';  // 展开时设置边框
      }
    }
  }
  // 监听鹰眼框展开和收起事件
  overviewMap.on('change:collapsed', (event) => {
    const collapsed = event.target.getCollapsed();
    setBorderStyle(collapsed);
  });
  // 初始状态设置边框
  setBorderStyle(overviewMap.getCollapsed());

  map.on('pointermove', function (e) {
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';

    if (hit) {
      const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });

      if (feature) {
        const info = feature.get('info');
        if (info) {
          // 创建一个提示框来显示图标名称
          const tooltip = document.getElementById('tooltip');
          tooltip.innerHTML = info.title; // 显示名称
          tooltip.style.left = e.originalEvent.pageX + 'px';
          tooltip.style.top = e.originalEvent.pageY + 'px';
          tooltip.style.display = 'block'; // 显示提示框
        }
      }
    } else {
      // 隐藏提示框
      const tooltip = document.getElementById('tooltip');
      tooltip.style.display = 'none';
    }
  });

  const pointsData = [
    {
      coordinates: [115.816, 39.664],
      info: {
        title: "北京上方山国家森林公园（东门）",
        titleURL: "https://baike.baidu.com/item/%E5%8C%97%E4%BA%AC%E4%B8%8A%E6%96%B9%E5%B1%B1%E5%9B%BD%E5%AE%B6%E6%A3%AE%E6%9E%97%E5%85%AC%E5%9B%AD/2329569",
        text: "北京上方山国家森林公园（东门）位于北京市房山区韩村河镇，是游客探访这片宁静自然景观的主要入口。上方山公园作为一座集自然、佛教和溶洞为一体的综合性国家森林公园，从东门进入，可以体验爬山、云梯等户外活动",
        imgURL: require("@/assets/东门.png"),
        iconURL: require("@/assets/东门.png"),
        iconScale: 0.08,
        imgWidth: '350px',
        imgHeight: '250px'
      }
    },
    {
      coordinates: [115.8208, 39.6695],
      info: {
        title: "筏（发）汗岭",
        titleURL: "",
        text: "筏（发）汗岭的名字来源于攀登该岭需要较大的体力消耗，使人发汗。登上发汗岭不仅可以体验到挑战自我的乐趣，还能在山頂享受周围自然景观的视觉盛宴。站在发汗岭上，可以俯瞰整个上方山国家森林公园的美丽景色，包括清晰的峰峦轮廓和茂密的原始次生林，这种体验会让人忘记登山的劳累",
        imgURL: require("@/assets/发汗岭.jpg"),
        iconURL: require("@/assets/发汗岭.jpg"),
        iconScale: 0.08,
        imgWidth: '300px',
        imgHeight: '400px'
      }
    },
    {
      coordinates: [115.8224, 39.6758],
      info: {
        title: "兜率寺",
        titleURL: "",
        text: "兜率寺的由来可以追溯到明代，它曾是著名的佛教僧侣修行和学习的地方。天王殿横匾【兜率寺】为一诚法师所题；迎面殿中供弥勒菩萨，弥勒菩萨像后供韦驮；两旁供四大天王：东方持国天王，南方增长天王，西方广目天，北方多闻天王；出天王殿，院落中央为大雄宝殿，横匾「佛光普照」",
        imgURL: require("@/assets/兜率寺.jpg"),
        iconURL: require("@/assets/兜率寺.jpg"),
        iconScale: 0.08,
        imgWidth: '350px',
        imgHeight: '200px'
      }
    },
    {
      coordinates: [115.819, 39.676],
      info: {
        title: "槐树王",
        titleURL: "",
        text: "吕祖阁南边不远处，是通往云水洞的山道，它也是游客必经的一条山道，在这条山道上，有一棵冠大荫浓、青翠茁壮的古槐矗立在路中央，它是目前上方山发现海拔最高，树干最长，胸径最粗的古槐，树高31米，胸径1.24米，胸围4米，为一级古树，树龄1100年",
        imgURL: require("@/assets/槐树王.jpg"),
        iconURL: require("@/assets/槐树王.jpg"),
        iconScale: 0.08,
        imgWidth: '300px',
        imgHeight: '400px'
      }
    },
    {
      coordinates: [115.824, 39.6706],
      info: {
        title: "钟楼",
        titleURL: "",
        text: "钟楼是位于北京上方山国家森林公园内的一个标志性建筑，它不仅具有装饰性作用，还是公园内的一个重要文化景观。钟楼通常建在高处，以便于敲响的钟声能够远传，提醒人们时间的流逝",
        imgURL: require("@/assets/钟楼.png"),
        iconURL: require("@/assets/钟楼.png"),
        iconScale: 0.08,
        imgWidth: '300px',
        imgHeight: '250px'
      }
    },
    {
      coordinates: [115.813, 39.672],
      info: {
        title: "骆驼峰",
        titleURL: "",
        text: "因其外形酷似一只伏地休息的骆驼而得名。骆驼峰的山体由若干个大小不一的岩石组成，这些岩石的排列和形状巧妙地模拟了骆驼的轮廓，包括驼峰和四肢在内的细节，都栩栩如生，令人赞叹大自然的鬼斧神工",
        imgURL: require("@/assets/骆驼峰.jpg"),
        iconURL: require("@/assets/骆驼峰.jpg"),
        iconScale: 0.08,
        imgWidth: '300px',
        imgHeight: '250px'
      }
    },
    {
      coordinates: [115.8231, 39.677],
      info: {
        title: "藏经阁",
        titleURL: "",
        text: "坐北朝南，正殿三间，为两层楼阁，正殿两侧各有夹殿三间。藏经阁的建筑风格保持了传统的汉式佛教建筑特点。除了作为佛教经典的收藏之所，藏经阁也是游客了解佛教文化的重要地点。在这里，人们不仅可以参观和阅读到各种佛教经典，还可以感受到佛教的宁静与祥和，欣赏到上方山的自然美景",
        imgURL: require("@/assets/藏经阁.png"),
        iconURL: require("@/assets/藏经阁.png"),
        iconScale: 0.08,
        imgWidth: '350px',
        imgHeight: '200px'
      }
    },
    {
      coordinates: [115.8206, 39.67611],
      info: {
        title: "文殊殿",
        titleURL: "",
        text: "文殊殿为兜率寺西第一大寺，在上方诸寺中规模仅次于兜率寺，与接待庵、地藏殿、吕祖阁相匹。殿外有古柏数株，古藤穿柏腹而生，肌理相连，枝叶各异，乃上方山一大奇观，名为一龙缠九柏。文殊殿专门供奉佛教中的文殊菩萨。文殊菩萨在佛教中代表着智慧和辩才，是学子们祈愿学业有成、增长智慧的重要对象，因此备受尊敬",
        imgURL: require("@/assets/文殊殿.jpg"),
        iconURL: require("@/assets/文殊殿.jpg"),
        iconScale: 0.06,
        imgWidth: '350px',
        imgHeight: '250px'
      }
    },
    {
      coordinates: [115.8103, 39.6739],
      info: {
        title: "云水洞",
        titleURL: "",
        text: "上方山云水洞，是中国北方最大的溶洞之一，享有“幽燕奥室”之美誉。洞内深达六百多米，自然形成了六个气势恢宏的大厅，每个大厅都各具特色，美不胜收",
        imgURL: require("@/assets/云水洞.png"),
        iconURL: require("@/assets/云水洞.png"),
        iconScale: 0.06,
        imgWidth: '350px',
        imgHeight: '250px'
      }
    },
    {
      coordinates: [115.8182, 39.67776],
      info: {
        title: "柏树王",
        titleURL: "",
        text: "柏树王位于上方山回龙峰下、海拔500米的吕祖阁院内。树高24米，干围达6米，相传种植于晋代，距今已有1600多年，号称北京郊区最粗大的一株大柏树。有人为其作诗云：“天尊驾前通灵草，偷得浮生堕凡轮。吕祖阁中经寒暑，风流千载定乾坤",
        imgURL: require("@/assets/柏树王.jpg"),
        iconURL: require("@/assets/柏树王.jpg"),
        iconScale: 0.06,
        imgWidth: '300px',
        imgHeight: '400px'
      }
    },
    {
      coordinates: [115.8210, 39.671],
      info: {
        title: "云梯",
        titleURL: "",
        text: "云梯紧邻圣水峪，是登上方山必经的险道。云梯由明代司礼监冯保所建，共有262级，沿路磐石为级，旁边配有索道供人攀扶。攀登云梯仿佛置身悬空之感，顶端有一处名为云梯庵的庵堂，站在此处可远眺群山，视野极好",
        imgURL: require("@/assets/云梯.png"),
        iconURL: require("@/assets/云梯.png"),
        iconScale: 0.1,
        imgWidth: '300px',
        imgHeight: '350px'
      }
    },
    {
      coordinates: [115.8214, 39.67472],
      info: {
        title: "塔院",
        titleURL: "",
        text: "塔院的历史可以追溯到东汉时期，据说这里曾是印度高僧华严宗祖师慧晟大师驻锡之地，因此有着深厚的佛教文化底蕴。塔院的主要建筑包括七级密檐砖塔、方形石基和六角形石幢。这些建筑的结构精致，雕刻细腻，展现了明代的建筑风格和工艺水平。特别是七级密檐砖塔，其造型独特，古朴典雅，是塔院的核心建筑",
        imgURL: require("@/assets/塔院.jpg"),
        iconURL: require("@/assets/塔院.jpg"),
        iconScale: 0.08,
        imgWidth: '250px',
        imgHeight: '320px'
      }
    },
    {
      coordinates: [115.8208, 39.6728],
      info: {
        title: "华严洞",
        titleURL: "",
        text: "华严洞的开发可追溯到东汉光武十年，当时华严祖师慧晟大师选择在上方山天然洞穴修行，称之为“华严洞”。这里不仅是佛教华严宗的发源地之一，还是历代高僧修行和传承佛法的重要场所",
        imgURL: require("@/assets/华严洞.jpg"),
        iconURL: require("@/assets/华严洞.jpg"),
        iconScale: 0.008,
        imgWidth: '350px',
        imgHeight: '250px'
      }
    }
  ];

  function createCircularImage(url, diameter, borderWidth = 5, borderColor = 'rgba(255, 0, 0, 0.8)') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();

    canvas.width = diameter;
    canvas.height = diameter;

    return new Promise((resolve) => {
      image.onload = () => {
        //绘制圆形容器
        context.beginPath();
        context.arc(diameter / 2, diameter / 2, diameter / 2, 0, 2 * Math.PI);
        context.clip();
        context.drawImage(image, 0, 0, diameter, diameter);

        //绘制边框
        context.lineWidth = borderWidth;
        context.strokeStyle = borderColor;
        context.beginPath();
        context.arc(diameter / 2, diameter / 2, diameter / 2 - borderWidth / 2, 0, 2 * Math.PI);
        context.stroke();

        resolve(canvas.toDataURL());
      };
      image.src = url;
    });
  }

  async function createFeatureStyle(iconURL) {
    const circularImageURL = await createCircularImage(iconURL, 50, 2, 'rgba(255, 0, 0, 0.8)');
    return new Style({
      image: new Icon({
        src: circularImageURL,
        scale: 1,
      })
    });
  }

  const featurePromises = pointsData.map(async (pointData) => {
    const feature = new Feature({
      geometry: new Point(fromLonLat(pointData.coordinates)),
      info: pointData.info,
    });
    const style = await createFeatureStyle(pointData.info.iconURL);
    feature.setStyle(style);
    return feature;
  });

  Promise.all(featurePromises).then((features) => {
    const featureLayer = new VectorLayer({
      source: new VectorSource({
        features: features
      }),
      visible: true
    });
    map.addLayer(featureLayer);
    setupPopup(map);
  });

  return map;
}

export function setupPopup(map) {
  const container = document.getElementById('popup')
  const content = document.getElementById('popup-content')
  const closer = document.getElementById('popup-closer')

  const popup = new Overlay({
    element: container,
    autoPan: true,
    positioning: 'bottom-center',
    stopEvent: false,
    autoPanAnimation: { duration: 250 }
  })
  map.addOverlay(popup)

  if (closer) {
    closer.onclick = function () {
      popup.setPosition(undefined);
      closer.blur();
      return false
    }
  }

  map.on('click', function (evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature;
    })
    if (feature) {
      content.innerHTML = '';
      const info = feature.get('info');
      if (info) {
        addFeatureInfo(info);
        popup.setPosition(feature.getGeometry().getCoordinates());
      }
    }
  });

  map.on('pointermove', function (e) {
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });

  function addFeatureInfo(info) {
    const elementA = document.createElement('a');
    elementA.className = "markerInfo";
    elementA.href = info.titleURL;
    setInnerText(elementA, info.title);
    content.appendChild(elementA);

    const elementDiv = document.createElement('div');
    elementDiv.className = "markerText";
    setInnerText(elementDiv, info.text);
    content.appendChild(elementDiv);

    const elementImg = document.createElement('img');
    elementImg.src = info.imgURL;
    elementImg.style.width = info.imgWidth;
    elementImg.style.height = info.imgHeight;
    content.appendChild(elementImg);
  }

  function setInnerText(element, text) {
    if (typeof element.textContent === "string") {
      element.textContent = text;
    } else {
      element.innerText = text;
    }
  }
}