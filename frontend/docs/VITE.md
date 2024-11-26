# Vite
Originally the app was created in `create-react-app` utility. As it is not supported anymore the project was switched to
Vite that offers very similar functionality.

Dependencies of the app are located in the [package.json](../package.json) file, all the NodeJs run configurations are defined 
here. Tasks can be executed by running `npm ${NAME_OF_THE_TASK}` Task that are available are:
* start - Task that brings up react development server that auto updates the code as the sources are changed.
* build - Task that builds minified javascript files and stores them in `${PROJECT_ROOT}/frontend/build` directory.

