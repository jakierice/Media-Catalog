# Media Catalog

This project is a React and TypeScript single page application that allows users to view and manage a catalog of media content. Users have various controls that allow them to more easily parse through content while viewing it, and users are able to add and update content data.

## Local Development

To run this project on your local machine, open the project in your terminal of choice and run the followwing command from the root directory:

```bash
npm start
```

The above command runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Tooling

The following sections summarize what tools have been used to build this application. Each section details why the tool was chosen and how it is used in the application.

### [Mobx](https://mobx.js.org/README.html)

Mobx is used for creating a centralized reactive state managemement model for all business and data logic related to media content. The `MediaContentStore` is constructed with an API service which is used for fetching media content data from a remote resource. The fetched data is maintained as a Mobx `observable`, so any changes to the data are immediately reflected in any computed values or UI components that are observing that data. Various operations can be performed on the data from the external service such as adding new data, updating existing data, or removing data.

In order to display the media content data constrained by multiple filter value states, the `MediaContentStore` implements a `get` method which observes the media content data state and computes a filtered list of data using the filter value that the user has input. The application's `MediaList` component is provided the filtered list from the `get mediaContent` method as a prop, and so the `MediaList` reactively updates anytime a filter value state is changed.

### [rxjs](https://rxjs.dev/)

The `MediaContent.service` uses `rxjs` to implement an asynchronous requests for data from an external resource. Use of the `rxjs` based service methods result in declarative and composable operations on data across its lifespan. The usage in this project is currently limited because the API service is shallowly mocked using a function that returns `setTimeout` delayed `Promise`.

### [MUI (Material UI)](https://mui.com/)

MUI is used for providing consistent styles and responsive layout throughout the application. The library contains a verbose set of common UI components that can be easily composed together to create rich user workflows without sacrificing consistency or productivity. This promotes focus on the novel user problems that the application aims to solve. Furthermore, powerful style customization can be applied across the entire application by creating new themes and providing them as a context to the top level MUI theme provider. This also makes it possible for allowing users to select between many different themes based on their preference. Currently, this project only uses MUI's "Material UI" theme based on Google's Material UI design system.

### [zod](https://github.com/colinhacks/zod)

This application relies on data from multiple external resources: a (mock) API and user input. To make sure that the data is the appropriate type at both runtime and compile time (type checking from TypeScript), the `zod` library is used to define the expected data schemas for content media from the API and values provided by the user during creation and editing of media items.

`zod` schemas are straight forward representations of common data types that can be powerfully composed and refined in order to validate that the data the application is taking in can be handled as expected. Furthermore, TypeScript types can be derived from the defined schemas so that the development/compile time types reflect the data contract as specified by the schema. This pattern allows for early identification and safe handling of changes in data contracts or breaking changes in data contracts that need to be addressed.

### [remote-data-ts](https://github.com/devexperts/remote-data-ts)

Because this application relies on data from an external service, the data needs to be modeled and managed through the course of an asynchronous request lifecycle. The `remote-data-ts` library provides an algebraic data type (AKA tagged union) called `RemoteData` that models the finite states that an asynchronous request can be in. The library also provides various type and function utilities that allow for intuitive usage and management of any data modeled with the `RemoteData` type.

The main advantages of modeling asynchronous external data with `RemoteData` are that it guarantees that all state cases of asynchronousdata are handled. This means that:

1. An appropriate UI is displayed before a request is made
2. Users are shown UI loading states when a request has been made and the response is pending
3. Failed requests are handled in some way such as showing the user a meaningful message about the request error instead of crashing the application
4. Data is only shown in the UI once it has been successfully retrieved from the external resource

This application also uses the pending and failure states of the initial data fetching request to disable any controls that operate on the media content data requested from the external API.

Learn more about the `RemoteData` algebraic data type by [reading this article](https://medium.com/@gcanti/slaying-a-ui-antipattern-with-flow-5eed0cfb627b).

### [ts-pattern](https://github.com/gvergnaud/ts-pattern)

`ts-pattern` is a utility library that provides an intuitive function API for pattern matching on data and computing results based on the matched pattern. Pattern matching is used in various places within this application for rendering specific text or other UI based on the enumerated value of specific data like the type of content or the state of observed data like the media content `RemoteData` maintained in the `MediaContentStore`. Specifically, the usage of `ts-pattern` in this application leverages the `exhaustive` method to make sure that every variation of an enumarted value or stated is handled appropriately.

## Features

### Media Catalog List

The primary view of this application displays a list of media content items with their related data. Each media content item shows the user the title, rating, genre, type, and release year for that item. The list is responsive, so it does not take up an obnoxious amount of space on wider viewports and UI component layouts are adjusted to wrap or reposition on smaller viewports. Every item also has additional visual indication of its type using Material icons next to the media content item's data.

#### Filtering Media

Users are able to input a title and/or type of content into the controls above the media list in order to filter down the list to show only media content items that match both of the filters provided. Filters can be completely cleared if either of the filters contains input.

The media list is reactively updated to display only values that match both of the filter values.

### Adding New Media

Users are able to add new media to the media list by clicking on the icon button floating at the bottom right of the screen. Once the button is clicked, a blank form is displayed in a modal with fields for all of the required data fields for a media item. Each field must pass validation based on the schema for a media content item. If any of the fields are invalid, such as the title being empty, then the user cannot submit the form and create a new item.

### Updating and Deleting Media

If a user needs to change the data associated with a media content item or delete the item, they can open the item's action menu found on the right side of every item in the media list. The action menu contains buttons for editing and deleting.

Clicking on the "Edit" menu button will open a modal with a form containing the values of the media item for which the action menu was opened. The user can edit any of the data, and the data for the corresponding item will automatically update in the media list's state because the form values are `observable`s provided from the `MediaContentStore`. In the future, a Mobx `reaction` could be added to make an update request to the external media API whenever an item is changed, but that is not yet included in this project.

Clicking on the "Delete" menu button will immediately remove the item from the media list. Like the "edit" action, a reaction could be added in the future to automatically make a deletion request to the external media API as an effect of a user deleting an item in the UI.

## Notes

- Data is seeded from mock data when the page loads and any updates to the media content data are not persisted. Therefore, every page load will show the same mock data.
- Asynchronous requests for data from an API are currently mocked using a delayed `Promise` resolution. The API for the async request for fetching data in `MediaContent.service` would likely remain the same once a real API was developed and implemented.
- Only the Read operation has been implemented in the `MediaContent.service` at this point due to time constraints. The Create, Update, and Delete operations can be added later either as mock implementations or backed by a real service API.
- This is the first time I have worked with `rxjs` and Mobx together, so the extent of my implementation was limited to what made immediate sense and for what time allowed. I enjoyed learning more about Mobx and would like to work more with it in the future. I'd also like to see and learn more about how `rxjs` and Mobx could be used together.
- The file structure of this project is purposefully flat in order to not distract from the solution itself. For a production application that would be maintained by myself and many others, I would organize modules in an agreed upon file structure scheme.
- Unit and integration tests have not been included due to time constraints. However, I would add both unit and integration tests for the critical domain/business logic impelementations such as the `MediaContentStore` and other aspects that aren't already well tested by the libraries used in this application. The `MediaContentStore`'s implementation is structured with the `MediaContent.service` as an injectable dependency so that it could be tested with a mock implementation in the future when the `MediaContent.service` is implemented with a real API. User facing functionality such as view navigation, the opening/closing of menus and modals, and form input could benefit from user focused automated tests implemented with a framework like [Cypress](https://www.cypress.io/).
