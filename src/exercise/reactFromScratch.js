// https://www.youtube.com/watch?v=KJP1E-Y-xyo&ab_channel=JSConf

/*function add() {
    let foo = 1;

    // doAddition closes over the foo variable defined outside of its scope
    return function doAddition() {
        foo = foo + 1;
        return foo;
    };
}

const doAddition = add();

console.log(doAddition());
console.log(doAddition());
console.log(doAddition());
console.log(doAddition())*/
;

// Concepts
// 1. closure
// 2. State and setState are just managed inside React. State management and storing happens in React function.
// 3. // The situation complicates if you want to have multiple states and React has to manage multiple states for the component.
// Hooks are arrays. State is saved in these array. And apparently here it just manages the state in the array, not the array of the pair btw the state and the function callback
// React IIFE is initialized only once when the app is running, but Component is rendered multiple times.
// When Component is rendered multiple times, useState inside React is called, which sets the index, but state is not deleted, becuase it is defined outside of the functions: useState and render.
// I did not get what he meant when he said that setState is called asynchronously, and I think it just means that hooks is updated, but in the wrong place because it is the wrong index;
// In React, state is managed in a list and recovered based on the indexed order of the useStates in the component.
// Rules of Hooks:
    // Order in which Hooks are called matters; the same order must be kept
    // Hooks must be called in a React function component
    // Hooks must be called at the top of the function component
    // Don’t call Hooks inside loops, conditions, or nested functions


// React has the concept of a work loop. It checks whether there is any work to be done. This is when render is triggered.

const React = (
    function () {
        let hooks = []
        let index = 0

        // useState closes over the _val variable defined outside of its scope
        function useState(initValue) {
            const state = hooks[index] || initValue;

            // freeze the value; each useState call will have a setState that will close over the value of _idx
            // a = 1;
            // b = a;
            // a = 3; b?
            //  when you assign a variable to another variable with a primitive value, you're copying the value,
            //  not creating a reference to the original variable.
            const _idx = index

            const setState = newValue => {

                hooks[_idx] = newValue;

            };
            index = index + 1
            return [state, setState];

        }


        function render(Component) {
            index = 0
            const C = Component()
            C.render()
            return C
        }

        function useEffect(callback, dependencyArray) {
            let hasChanged = true

            // detect change
            const oldDependency = hooks[index] // sometimes undefined

            if (oldDependency) {
                hasChanged = dependencyArray.some((dep, i) => !Object.is(dep, oldDependency[i]))
            }


            if (hasChanged) callback()
            hooks[index] = dependencyArray
            index++
        }


        return {useState, render, useEffect};
    }
)();

function Component() {
    const [count, setCount] = React.useState(1);
    const [text, setText] = React.useState('apple');

    React.useEffect(() => {
        console.log('Sync with external world')
    }, [count, text])

    return {
        render: () => console.log({count, text}),
        click: () => setCount(count + 1),
        type: (word) => setText(word)
    }
}

//1.  First render
console.log("1st Render")
let App = React.render(Component)

//2. user clicks
App.click()
// then React does another render
console.log("2nd Render")
App = React.render(Component)

//3. user types
App.type('pear')
// then React does another render
console.log("3rd Render")
App = React.render(Component)
