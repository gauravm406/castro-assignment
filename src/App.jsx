import { useCallback, useEffect, useRef, useState } from "react";
import s from "./App.module.css";
import StoryModal from "./components/StoryModal";

function App() {
  const [stories, setStories] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [selectedStory, setSelectedStory] = useState({});
  const timeout = useRef(null);

  // fetch stories
  useEffect(() => {
    async function fetchStories() {
      try {
        const res = await fetch("/stories.json");
        const data = await res.json();
        setStories(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, []);

  // horizontal scrolling on stories list
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.deltaY === 0) return;

      e.preventDefault();

      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handleSelectedStory = useCallback((e, id, src) => {
    setSelectedStory({ id, src });
  }, []);

  const onClose = useCallback(() => {
    setSelectedStory({});
  }, []);

  // auto next story after 5 seconds
  useEffect(() => {
    if (
      !selectedStory ||
      Object.keys(selectedStory).length === 0 ||
      stories.length === 0
    )
      return;

    timeout.current = setTimeout(() => {
      const nextStory = stories.find((story) => {
        if (selectedStory.id === stories[stories.length - 1].id) {
          return story.id === stories[0].id;
        }

        return story.id === selectedStory.id + 1;
      });
      setSelectedStory(nextStory);
    }, 5000);

    return () => clearTimeout(timeout.current);
  }, [selectedStory, stories]);

  // next story
  const goToNextStory = useCallback(() => {
    clearTimeout(timeout.current);
    if (selectedStory.id === stories[stories.length - 1].id) {
      setSelectedStory(stories[stories.length - 1]);
      return;
    }

    const nextStory = stories.find((story) => {
      return story.id === selectedStory.id + 1;
    });

    setSelectedStory(nextStory);
  }, [selectedStory, stories]);

  // prev story
  const goToPrevStory = useCallback(() => {
    clearTimeout(timeout.current);
    if (selectedStory.id === stories[0].id) {
      setSelectedStory(stories[0]);
      return;
    }

    const prevStory = stories.find((story) => {
      return story.id === selectedStory.id - 1;
    });

    setSelectedStory(prevStory);
  }, [stories, selectedStory]);

  return (
    <>
      <div className={s.app_main} ref={scrollRef}>
        {isLoading
          ? "...loading"
          : stories.map(({ id, src }) => (
              <div
                role="button"
                key={id}
                className={s.story_image}
                onClick={(e) => handleSelectedStory(e, id, src)}
              >
                <img alt="story" src={src} />
              </div>
            ))}
      </div>

      <StoryModal
        selectedStory={selectedStory}
        onClose={onClose}
        goToNextStory={goToNextStory}
        goToPrevStory={goToPrevStory}
      />
    </>
  );
}

export default App;
