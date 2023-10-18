import React, { useReducer, useEffect, useRef } from 'react'
import Layout from '../common/Layout'

const { kakao } = window;

function reducer(state, action){
  switch (action.type){
    case "INFO":
      return {
        title: action.title,
        latlng: action.latlng,
        imgSrc: action.imgSrc,
        imgSize: new kakao.maps.Point(1146, 99),
        imgPoz: { offset: new kakao.maps.Point(116, 99)}
      };
    case "SET_LOCATION":
      return {
        ...state, location: action.loadMap
      };
    case "TOGGLE_TRAFFIC":
      return {
        ...state, traffic: !state.traffic
      };
    case "SET_INDEX":
      return {
        ...state, index: action.idx
      };
    default: 
      return state;
      // throw new Error(`타입이 다른디. ${action.type}`);
  }
}

const initialState = {
  location : null,
  traffic : false,
  index : 0,
  info : [
    {
      title: "우리인재개발원",
      latlng: new kakao.maps.LatLng(37.4868352, 126.7830001),
      imgSrc: process.env.PUBLIC_URL + "/img/marker1.png",
      imgSize: new kakao.maps.Point(1146, 99),
      imgPoz: { offset: new kakao.maps.Point(116, 99) }
    },
    {
      title: "바다1",
      latlng: new kakao.maps.LatLng(36.4868352, 126),
      imgSrc: process.env.PUBLIC_URL + "/img/marker2.png",
      imgSize: new kakao.maps.Point(1146, 99),
      imgPoz: { offset: new kakao.maps.Point(116, 99) }
    },
    {
      title: "바다2",
      latlng: new kakao.maps.LatLng(36.30000, 124.00000),
      imgSrc: process.env.PUBLIC_URL + "/img/marker3.png",
      imgSize: new kakao.maps.Point(1146, 99),
      imgPoz: { offset: new kakao.maps.Point(116, 99) }
    }
  ] 
  
}

function Location() {
  
  const [state, dispatch] = useReducer(reducer, initialState);

  const container = useRef(null);

  const {location, traffic, index, info} = state;

  const options = { //지도를 생성할 때 필요한 기본 옵션
    center: info[index].latlng, //지도의 중심좌표.
    level: 3 //지도의 레벨(확대, 축소 정도)
  };


  //  useState와 useEffect를 섞어 사용할 땐, 순서를 바로 알아야한다. state값이 없는 상태에서 useEffect가 실행되면 에러가 발생

  const imgSrc =  info[index].imgSrc;
  const imgSize = info[index].imgSize;
  const imgPoz = info[index].imgPoz;
  const markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgPoz);
  
  useEffect(() => { // 직접적으로 지도를 그려줌
    container.current.innerHTML = ""; // 리셋

    const marker = new kakao.maps.Marker({
      position: options.center,
      image: markerImage,
    })

    const map_instance = new kakao.maps.Map(container.current, options);
    marker.setMap(map_instance);
    // setLocation(map_instance);
    dispatch({type: "SET_LOCATION", loadMap: map_instance});

    const mapTypeControl = new kakao.maps.MapTypeControl(); //스카이뷰
    map_instance.addControl(mapTypeControl, kakao.maps.ControlPosition.BOTTOMLEFT);

    const zoomControl = new kakao.maps.ZoomControl(); //줌
    map_instance.addControl(zoomControl, kakao.maps.ControlPosition.LEFT);

    const handleResize = ()=>{
      map_instance.setCenter(info[index].latlng);
      // resize 이벤트가 일어날 때 실행될 함수
    }
    window.addEventListener("resize", handleResize);
    return ()=>{
      // 언마운트될 때, event를 remove함
      window.removeEventListener("resize", handleResize)
    }

    // 마운트될 때 실제적으로 map에 그려주는 map_instance 변수에 담긴 값이 구현되야 맵이 그려지기 때문에 setLocation을 통해 map_instance의 state값을 변경시켜 첫 렌더링 때 그려준다. Location -> state에 담김
  }, [index, info, kakao.maps.ControlPosition.BOTTOMLEFT, kakao.maps.ControlPosition.LEFT, kakao.maps.Map, kakao.maps.MapTypeControl(), kakao.maps.ZoomControl()])

  useEffect(() => {
    if (!location) return;
    // 초기 마운트에서는 Location이 없기 때문에 아래의 오버레이를 불러올 수 없기 때문에 오류가 발생함으로 if문으로 return해야 한다.
    traffic === true && location.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
    traffic === false && location.removeOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
  }, [traffic])

  return (
    <Layout name={"Location"}>
      <p>Location</p>
      <div id="map" ref={container}></div>
      <button onClick={() => dispatch({type: "TOGGLE_TRAFFIC"})}>{traffic ? "Traffic 끄기" : "Traffic 켜기"}</button>
      <ul className="branch">
        {/* <li onClick={() => { SetIndex(0) }}>{Info[0].title}</li>
        <li onClick={() => {  SetIndex(1) }}>{Info[1].title}</li>
        <li onClick={() => { SetIndex(2) }}>{Info[2].title}</li> */}
        {info.map((el, Index) => {
          return (
            <li className={Index === index ? "on" : ""} key={Index} onClick={() => {
              dispatch({type : "SET_INDEX", idx: Index});
            }}>{el.title}</li>
          )
        })}
      </ul>
    </Layout>
  )
}

export default Location


// useReducer 사용할 때 하나하나 dispatch 써서 사용하려했는데 구조분해할당을 배운 후 쉽게 해결했답니다