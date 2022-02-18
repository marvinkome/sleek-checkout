import { h, createContext } from "preact";
import { useReducer, useContext, useCallback, useMemo } from "preact/hooks";

export const RouterContext = createContext({
  activeRouteId: 0,
  goForward: () => {},
  goBack: () => {},
  goToRoute: (routeId: number) => {},
});

const reducer = (state: { activeRouteId: number }, action: any) => {
  switch (action.type) {
    case "GO_FORWARD": {
      return { activeRouteId: state.activeRouteId + 1 };
    }

    case "GO_BACK": {
      return { activeRouteId: state.activeRouteId > 0 ? state.activeRouteId - 1 : 0 };
    }

    case "GO_TO_ROUTE": {
      return { activeRouteId: action.routeId };
    }

    default:
      throw new Error(`Invalid action ${action.type}`);
  }
};

function useRouterState({ initialRouteId }: any) {
  const [state, dispatch] = useReducer(reducer, { activeRouteId: initialRouteId });

  const goForward = useCallback(() => dispatch({ type: "GO_FORWARD" }), []);
  const goBack = useCallback(() => dispatch({ type: "GO_BACK" }), []);
  const goToRoute = useCallback((routeId: number) => dispatch({ type: "GO_TO_ROUTE", routeId }), []);

  return {
    state,
    goForward,
    goBack,
    goToRoute,
  };
}

export function useRouter() {
  return useContext(RouterContext);
}

// route components
export const RouterProvider = ({ initialRouteId, ...props }: any) => {
  const { state, ...actions } = useRouterState({ initialRouteId });

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);
  return <RouterContext.Provider value={value}>{props.children}</RouterContext.Provider>;
};

export const Route = ({ routeId, component }: any) => {
  const { activeRouteId } = useRouter();

  if (activeRouteId !== routeId) return null;
  return component;
};
