import React from 'react';
import GitalkComponent from 'gitalk/dist/gitalk-component';
const Talk = () => {
  return (
    <>
      <GitalkComponent
        options={{
          clientID: 'e23b1b425c6f9c6c7e5e',
          clientSecret: '7ce70e4829d52d6ea7890962dc240ad7ee558d79',
          repo: 'better-pz.github.io',
          owner: 'better-pz',
          admin: ['better-pz'],
          id: location.pathname, // Ensure uniqueness and length less than 50
          distractionFreeMode: false, // Facebook-like distraction free mode
        }}
      ></GitalkComponent>
    </>
  );
};
export default Talk;
