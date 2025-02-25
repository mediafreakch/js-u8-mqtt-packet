
export function mqtt_decode_subscribe(ns, mqtt_reader) {
  class _subscription_options_ extends Number {
    get qos() { return this & 0x3 }
    get retain() { return this & 0x4 !== 0 }
    get retain_handling() { return (this >> 2) & 0x3 }
  }

  return ns[0x8] = (pkt, u8_body) => {
    let rdr = mqtt_reader.of(u8_body)

    pkt.pkt_id = rdr.u16()
    if (5 <= pkt.mqtt_level)
      pkt.props = rdr.props()

    let topic, opts, topic_list = pkt.topics = []
    while (rdr.has_more()) {
      topic = rdr.utf8()
      opts = rdr.flags(_subscription_options_)
      topic_list.push({topic, opts})
    }

    return pkt }
}
