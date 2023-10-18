import { useEffect, useRef, useState } from "react";
import Layout from "../common/Layout";
import Pop from "../common/Pop";
import axios from "axios";
import Masonry from "react-masonry-component";


const num = 100;
const user = '164021883@N04';

function Gallery() {
  const frame = useRef(null);
  const input = useRef(null);
  const pop = useRef(null);
  const [Items, setItems] = useState([]);
  const [Index, setIndex] = useState(0);
  const [Loading, setLoading] = useState(true);
  const [PrevItems, setPrevItems] = useState([]);

  const masonryOptions = {
    transitionDuration: "0.5s"
  };





  /*
  async/await를 사용한 코드는 비동기 작업의 흐름을 더 명확하게 보여줍니다
  또한 await를 통해서 axios호출이 완료될 때까지 기다리게 함으로써 코드의 실행 순서가 더 직관적으로 바뀝니다.
  */

  const getFlickr = async (obj) => {
    const key = '4612601b324a2fe5a1f5f7402bf8d87a';
    const method_interest = 'flickr.interestingness.getList';
    const method_user = 'flickr.people.getPhotos';
    const method_search = 'flickr.photos.search';

    let url = "";
    if (obj.type === "interest") {
      url = `https://www.flickr.com/services/rest/?method=${method_interest}&per_page=${num}&api_key=${key}&format=json&nojsoncallback=1`;
    }
    if (obj.type === "user") {
      url = `https://www.flickr.com/services/rest/?method=${method_user}&per_page=${num}&api_key=${key}&format=json&nojsoncallback=1&user_id=${user}`;
    }
    if (obj.type === "search") {
      url = `https://www.flickr.com/services/rest/?method=${method_search}&per_page=${num}&api_key=${key}&format=json&nojsoncallback=1&tags=${obj.tag}`;
    }


    try {
      const response = await axios.get(url);
      if (response.data && response.data.photos && response.data.photos.photo) {
        setItems(response.data.photos.photo);
        frame.current.classList.add("on");
        setLoading(false);
      } else {
        console.log("데이터형식 문제");
      }
    } catch (error) {
      console.log("에러");
    }
  }

  const showSearch = () => {
    const result = input.current.value.trim();
    if (!result) return alert("검색어를 입력하세요.");
    getFlickr({ type: "search", tag: result });
    input.current.value = "";
  }

  const handleNoSearchResult = () => {
    if (PrevItems.length > 0) {
      setPrevItems(PrevItems);
      setTimeout(() => {
        frame.current.classList.add("on");
        setLoading(false);
      }, 1000);
    } else {
      setLoading(true);
      frame.current.classList.remove("on");
      getFlickr({ type: 'interest' });
    }
  }

  useEffect(() => {
    if (Items.length === 0 && Loading === false) {
      alert("해당검색어가 없습니다. 다시 검색해주세요");
      handleNoSearchResult();
    }
  }, [])

  useEffect(() => {
    getFlickr({ type: "interest" });
  }, []);


  return (
    <>
      <Layout name={"Gallery"}>


        {Loading && <img src={`${process.env.PUBLIC_URL}/img/loading.gif`} alt="loading" className="loading" />}
        <div className="frame" ref={frame} >
          <button onClick={() => {
            setLoading(true);
            frame.current.classList.remove("on");
            getFlickr(getFlickr({ type: "user", user: user }));
          }}>my picture</button>

          <button onClick={() => {
            setLoading(true);
            frame.current.classList.remove("on");
            getFlickr(getFlickr({ type: "interest" }));
          }}>interested picture</button>

          <div className="searchBox">
            <input type="text" ref={input} onKeyUp={(e) => {
              if (e.key === "Enter") showSearch();
            }} />
            <button onClick={() => {
              showSearch();
            }}>search</button>
          </div>
          <Masonry elementType="div" options={masonryOptions}>
            {Items.map((el, index) => (
              <article key={index} onClick={() => {
                setIndex(index);
                // setOpen(true);
                pop.current.open();
              }}>
                <div className="inner">
                  <div className="pic">
                    <img src={`https://live.staticflickr.com/${el.server}/${el.id}_${el.secret}_m.jpg`} alt={`${el.title} image`} />
                  </div>
                  <h2>{el.title}</h2>
                </div>
              </article>
            ))}
          </Masonry>
        </div>
      </Layout >
      <Pop ref={pop}>
        {Items.length !== 0 && (<img src={`https://live.staticflickr.com/${Items[Index].server}/${Items[Index].id}_${Items[Index].secret}_b.jpg`} alt={`${Items[Index].title} image`} />)}
      </Pop>
    </>
  );
}

export default Gallery;
