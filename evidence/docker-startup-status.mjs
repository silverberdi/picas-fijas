export function isDockerVerified({ infoStatus, build, container, health }) {
  return infoStatus === 0 && build === 'PASS' && container === 'PASS' && health === 'PASS';
}
