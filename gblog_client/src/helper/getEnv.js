export const getEnv = (envname) => {
  const env = import.meta.env.envname;
  return env[envname];
};
