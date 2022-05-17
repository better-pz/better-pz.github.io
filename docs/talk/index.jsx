import React from 'react';
import GitalkComponent from 'gitalk/dist/gitalk-component';
const Talk = () => {
  let title = location.pathname.substr(0, 50);
  return (
    <>
      <GitalkComponent
        options={{
          clientID: 'e23b1b425c6f9c6c7e5e',
          clientSecret: '08075cddecc2e973a232a5e6c32fed694481e9de',
          repo: 'better-pz.github.io',
          owner: 'better-pz',
          admin: ['better-pz'],
          id: title, // Ensure uniqueness and length less than 50
          distractionFreeMode: false, // Facebook-like distraction free mode
        }}
      ></GitalkComponent>
    </>
  );
};
export default Talk;
