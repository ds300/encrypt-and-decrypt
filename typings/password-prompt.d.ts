declare module "password-prompt" {
  function prompt(prompt: string, options: { method: "hide" }): Promise<string>
  export = prompt
}
