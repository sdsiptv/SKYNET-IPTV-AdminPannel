import apis from 'app/api';
import React, { useEffect, useState } from 'react';

function SystemInformation() {
  const [info, setInfo] = useState(null);
  const getInfo = () => {
    apis.getSystemInfo().then(res => {
      let arr = res?.data;
      var object = arr.reduce(
        (obj, item) => Object.assign(obj, { [item.dataKey]: item.value }),
        {},
      );
      setInfo(object);
    });
  };
  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
          }}
        >
          <div>
            <h3>System Information</h3>
            <hr />
          </div>
          <div
            style={{
              display: 'flex',
              flex: 0.6,
              flexDirection: 'row',
            }}
          >
            <div
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flex: 0.5,
                  }}
                >
                  Product Name
                </div>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                  }}
                >
                  : {info?.productName}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flex: 0.5,
                  }}
                >
                  DRM ID
                </div>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                  }}
                >
                  : {info?.drmId}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flex: 0.5,
                    flexDirection: 'row',
                  }}
                >
                  Company Name
                </div>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                  }}
                >
                  : {info?.companyName}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flex: 0.5,
                    flexDirection: 'row',
                  }}
                >
                  Software Version
                </div>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                  }}
                >
                  : {info?.softwareVersion}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flex: 0.5,
                    flexDirection: 'row',
                  }}
                >
                  Installation Date
                </div>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                  }}
                >
                  : {info?.installationDate}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flex: 0.5,
                    flexDirection: 'row',
                  }}
                >
                  Product Version
                </div>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                  }}
                >
                  : {info?.productVersion}
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flex: 0.4,
                flexDirection: 'row',
              }}
            >
              <div>
                <img
                  src={info?.companyLogo}
                  alt=""
                  style={{ paddingLeft: '10px', width: '100px' }}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
          }}
        >
          <div>
            <h3>Network Information</h3>
            <hr />
          </div>
          <div
            style={{
              display: 'flex',
              flex: 0.6,
              flexDirection: 'row',
            }}
          >
            <div
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flex: 0.5,
                  }}
                >
                  Network Id
                </div>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                  }}
                >
                  : {info?.networkId}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flex: 0.5,
                    flexDirection: 'row',
                  }}
                >
                  Network Name
                </div>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                  }}
                >
                  : {info?.networkName}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flex: 0.5,
                    flexDirection: 'row',
                  }}
                >
                  GST
                </div>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                  }}
                >
                  : {info?.gst}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flex: 0.5,
                    flexDirection: 'row',
                  }}
                >
                  Address
                </div>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                  }}
                >
                  : {info?.address}
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flex: 0.4,
                flexDirection: 'row',
              }}
            >
              <div>
                <img
                  src={info?.networkLogo}
                  alt=""
                  style={{ paddingLeft: '10px', width: '100px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemInformation;
