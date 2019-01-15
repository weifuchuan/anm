# Anm JS UI framework

The Anm is JS UI framework, which use functional component and hooks like Anm. 

## API

```typescript
const h = createElement
/**
 * Create and return a new anm element of the given type. 
 * The type argument can be either a tag name string (such as 'div' or 'span'), an Anm component type (a function).
 * Code written with JSX will be converted to use Anm.createElement().
 * You will not typically invoke Anm.createElement() directly if you are using JSX. 
 * @param type
 * @param props
 * @param children
 */
function createElement(
	type: VNodeType,
	props: IProps = {},
	...children: VNode[]
): VNode

/**
 * Render a Anm element into the DOM in the supplied container.
 * If the Anm element was previously rendered into container, this will perform an update on it and only mutate the DOM as necessary to reflect the latest Anm element.
 * If the optional callback is provided, it will be executed after the component is rendered or updated.
 * @param vnode
 * @param container
 * @param callback
 */
function render(
	vnode: VNode, 
	container: Element, 
	callback?: Function
)

/**
 * Returns a stateful value, and a function to update it. 
 * During the initial render, the returned state (state) is the same as the value passed as the first argument (initialState).  
 * The setState function is used to update the state. It accepts a new state value and enqueues a re-render of the component.
 * @param initState
 */
function useState<S = any>(initState: S): [S, (s: S) => void]

function useEffect(effect: Effect, inputs?: any[])
```

