import { ACTIONS } from '../constant';

export const serveResponse = <T>(
  reqMethod: string,
  entity: string,
  data?: T,
) => {
  const action = ACTIONS[reqMethod] || ACTIONS.DEFAULT;
  return {
    success: true,
    message: `${entity} ${action} successfully`,
    data: data ?? null,
  };
};

export const serveBadResponse = <T>(entity: string) => {
  return {
    success: false,
    message: `${entity} not found`,
    data: null,
  };
};
