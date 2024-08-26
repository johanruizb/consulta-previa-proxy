const net = require("net");

function isIPv4MappedIPv6Address(ip) {
    return net.isIP(ip) === 6 && ip.startsWith("::ffff:");
}

function convertIPv6ToIPv4(ip) {
    if (isIPv4MappedIPv6Address(ip)) {
        return ip.split(":").pop();
    }
    return ip;
}

module.exports = {
    isIPv4MappedIPv6Address,
    convertIPv6ToIPv4,
};
