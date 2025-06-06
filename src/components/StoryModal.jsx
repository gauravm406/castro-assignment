import React, { useEffect, useState } from "react";
import s from "../App.module.css";

const StoryModal = ({
  selectedStory,
  onClose,
  goToPrevStory,
  goToNextStory,
}) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!selectedStory || Object.keys(selectedStory).length === 0) return;
    setKey((prev) => prev + 1);
  }, [selectedStory]);

  if (!selectedStory || Object.keys(selectedStory).length === 0) return null;

  return (
    <div className={s.story_modal}>
      <button onClick={onClose} type="button" className="">
        X
      </button>

      <div key={key} className={s.story_image_wrapper}>
        <img
          src={selectedStory.src}
          alt="Story"
          className={s.story_image_full}
        />
      </div>

      <div role="button" className={s.left_zone} onClick={goToPrevStory} />
      <div role="button" className={s.right_zone} onClick={goToNextStory} />
    </div>
  );
};

export default React.memo(StoryModal);
