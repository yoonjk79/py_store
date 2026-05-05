declare const Sk: any;

export const runPython = (code: string, onValueChange: (vars: any) => void, onError: (err: string) => void) => {
  if (typeof Sk === 'undefined') {
    onError("Skulpt is not loaded");
    return;
  }

  Sk.configure({
    output: (text: string) => console.log(text),
    read: (x: string) => {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
      return Sk.builtinFiles["files"][x];
    },
  });

  const promise = Sk.misceval.asyncToPromise(() => {
    return Sk.importMainWithBody("<stdin>", false, code, true);
  });

  promise.then(
    (module: any) => {
      const vars: Record<string, any> = {};
      for (const key in module.$d) {
        if (key.startsWith("__")) continue;
        const skVal = module.$d[key];
        vars[key] = Sk.ffi.remapToJs(skVal);
      }
      onValueChange(vars);
    },
    (err: any) => {
      onError(err.toString());
    }
  );
};
