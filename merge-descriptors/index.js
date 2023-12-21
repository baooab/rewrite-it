module.exports = mergeDescriptors;

function mergeDescriptors(target, source, overwrite = true) {
  for (const key of Object.getOwnPropertyNames(source)) {
    if (overwrite || !Object.hasOwn(target, key)) {
      const descriptor = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, descriptor);
    }
  }
  return target;
}
