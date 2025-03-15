# Template Props for GH Copilot

## New Component Props

This is the base prompt. Add and tweak
```
Create me a <COMPONENT_NAME> with the following requirements:
- <REQUIREMENTS>
- Props interface should extend test ID Interface
- It should add javadoc comments to the props interface, not jsdocs annotations
- Should export props interface.
- For any styles, make them follow atomic style so later on I can easily import them into a SCSS File
See `{MODEL_TEMPLATE}` for code style preferences


THEN, create me a cypress visual regression test with it's example uses from the Storybook file. Requirements are:
- Please use `{MODEL_TEMPLATE}` as code preferences
- Use `cy.mount`
- Use `cy.findByTestId(testId).matchImageSnapshot()` to get the proper element

Additional information.
- Please use path aliasing. Know that `@` is a reference to the source directory.
```
