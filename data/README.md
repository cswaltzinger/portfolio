# CLI Data store 

A lightweight executable file that can be used to store/retrieve sensitive data in the cli.
---
## Example

![demo](./demo.gif)
---

### Example usage: storing an API key

```bash
data --set api-keys/gemeni "$ABCDEFGHIJKLMNOPQRSTUVWXYZ"
```

### Example usage: getting an API key

```bash
GOOGLE_GEMENI_API_KEY=$(data --get api-keys/gemeni )
// or
GOOGLE_GEMENI_API_KEY=$(data --get gemeni )
...
```

### Example usage: storing/using an env

```bash
# Storing values of the env
data --set env/e1/ENV_VAL first_data_env
data --set env/e1/ENV_VAL2 first_data_env2
data --set env/e2/ENV_VAL2 second_data_env2
# using the stored env e1
env $(data --env env/e1 ) bash -c 'echo $ENV_VAL2'
### OUTPUT: first_data_env2
env $(data --env env/ ) bash -c 'echo $ENV_VAL2'
### OUTPUT: second_data_env2
```