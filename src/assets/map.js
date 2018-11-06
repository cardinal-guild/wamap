const points = {
  havenTopLeft: [895, 1000],
  havenTopRight: [1000, 1000],
  havenBottomRight: [1000, 0],
  havenBottomLeft: [895, 0],
  a1TopRight: [260, 1000],
  a2TopRight: [429, 1000],
  a3TopRight: [793, 1000],
  l1TopLeft: [0, 800],
  l1TopMiddle: [183, 847],
  l1TopRight: [300, 768],
  h3TopMiddle: [434, 830],
  h3TopRight: [566, 758],
  a5TopRight: [688, 760],
  o1TopRight: [895, 760],
  h1TopLeft: [0, 733],
  h1TopRight: [230, 609],
  hadesWindwallCenter: [319, 553],
  h4TopRight: [555, 667],
  h5TopLeft: [632, 456],
  h5TopMiddle: [788, 506],
  h5TopRight: [895, 496],
  k1TopLeft: [0, 474],
  k1TopRight: [92, 474],
  r1TopMiddle: [172, 502],
  r1TopRight: [342, 359],
  r2TopLeft: [395, 424],
  r2TopRight: [614, 423],
  r3TopLeft: [616, 338],
  r3TopRight: [895, 348],
  k2TopLeft: [0, 150],
  k2TopMiddle: [250, 192],
  k2TopRight: [315, 195],
  k3TopRight: [621, 186],
  k4TopRight: [895, 166],
  k2BottomRight: [322, 0],
  k3BottomRight: [616, 0],
  topLeft: [0, 1000],
  topRight: [1000, 1000],
  bottomRight: [1000, 0],
  bottomLeft: [0, 0],
};


/* eslint-disable */
export default {
  haven: {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [
            points.havenBottomLeft,
            points.havenTopLeft,
            points.havenTopRight,
            points.havenBottomRight
          ]
        ],
      },
    }]
  },
  tier1Regions: {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              [0, 1000],
              points.a1TopRight,
              points.l1TopMiddle,
              points.l1TopLeft,
            ]
          ]
        ],
      },
      'properties': {
        'popupContent': 'This is a free bus line that will take you across downtown.',
        'underConstruction': true
      },
      'label': 'A1',
      'id': 1
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.a3TopRight,
              points.havenTopLeft,
              points.o1TopRight,
              points.a5TopRight,
            ]
          ]
        ],
      },
      'properties': {
        'popupContent': 'This is a free bus line that will take you across downtown.',
        'underConstruction': true
      },
      'label': 'A4',
      'id': 4
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              [0, 0],
              points.k2TopLeft,
              points.k2TopMiddle,
              points.k2TopRight,
              points.k2BottomRight
            ]
          ]
        ],
      },
      'properties': {
        'popupContent': 'This is a free bus line that will take you across downtown.',
        'underConstruction': true
      },
      'label': 'K2',
      'id': 17
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.k3TopRight,
              points.k4TopRight,
              points.havenBottomLeft,
              points.k3BottomRight
            ]
          ]
        ],
      },
      'properties': {
        'popupContent': 'This is a free bus line that will take you across downtown.',
        'underConstruction': true
      },
      'label': 'K4',
      'id': 19
    }]
  },
  //         [
  //
  //         ],
  //         [
  //         ],
  //         [
  //         ]
  //       ]
  //     ]
  //   },
  // },
  tier2Regions: {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.a1TopRight,
              points.l1TopMiddle,
              points.l1TopRight,
              points.h3TopMiddle,
              points.a2TopRight
            ],
          ]
        ],
        'properties': {
          'popupContent': 'This is a free bus line that will take you across downtown.',
          'underConstruction': true
        },
        'label': 'A2',
        'id': 2
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.a2TopRight,
              points.h3TopMiddle,
              points.h3TopRight,
              points.a5TopRight,
              points.a3TopRight
            ],
          ]
        ],
        'properties': {
          'popupContent': 'This is a free bus line that will take you across downtown.',
          'underConstruction': true
        },
        'label': 'A3',
        'id': 3
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.h3TopRight,
              points.a5TopRight,
              points.h5TopMiddle,
              points.h5TopLeft,
              points.h4TopRight
            ],
          ]
        ],
        'properties': {
          'popupContent': 'This is a free bus line that will take you across downtown.',
          'underConstruction': true
        },
        'label': 'A5',
        'id': 7
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.k1TopLeft,
              points.k1TopRight,
              points.k2TopMiddle,
              points.k2TopLeft
            ],
          ]
        ],
        'properties': {
          'popupContent': 'This is a free bus line that will take you across downtown.',
          'underConstruction': true
        },
        'label': 'K1',
        'id': 13
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.k2TopRight,
              points.k3TopRight,
              points.k3BottomRight,
              points.k2BottomRight
            ],
          ]
        ],
        'properties': {
          'popupContent': 'This is a free bus line that will take you across downtown.',
          'underConstruction': true
        },
        'label': 'K3',
        'id': 18
      }
    }]
  },
  tier3Regions: {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.l1TopLeft,
              points.l1TopMiddle,
              points.l1TopRight,
              points.h1TopRight,
              points.h1TopLeft
            ],
          ]
        ],
        'properties': {
          'popupContent': 'This is a free bus line that will take you across downtown.',
          'underConstruction': true
        },
        'label': 'H1',
        'id': 5
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.a5TopRight,
              points.o1TopRight,
              points.h5TopRight,
              points.h5TopMiddle
            ],
          ]
        ],
        'properties': {
          'popupContent': 'This is a free bus line that will take you across downtown.',
          'underConstruction': true
        },
        'label': '01',
        'id': 8
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.k1TopRight,
              points.r1TopMiddle,
              points.r1TopRight,
              points.k2TopRight,
              points.k2TopMiddle,
            ],
          ]
        ],
        'properties': {
          'popupContent': 'This is a free bus line that will take you across downtown.',
          'underConstruction': true
        },
        'label': 'R1',
        'id': 14
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.r1TopRight,
              points.r2TopLeft,
              points.r2TopRight,
              points.r3TopLeft,
              points.k3TopRight,
              points.k2TopRight,
            ],
          ]
        ],
        'properties': {
          'popupContent': 'This is a free bus line that will take you across downtown.',
          'underConstruction': true
        },
        'label': 'R2',
        'id': 15
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.r3TopLeft,
              points.r3TopRight,
              points.k4TopRight,
              points.k3TopRight,
            ],
          ]
        ],
        'properties': {
          'popupContent': 'This is a free bus line that will take you across downtown.',
          'underConstruction': true
        },
        'label': 'R3',
        'id': 16
      }
    }]
  },
  tier4Regions: {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.h1TopLeft,
              points.h1TopRight,
              points.r1TopMiddle,
              points.k1TopRight,
              points.k1TopLeft
            ],
          ]
        ],
        'properties': {
          'popupContent': 'This is a free bus line that will take you across downtown.',
          'underConstruction': true
        },
        'label': 'H1',
        'id': 9
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.h1TopRight,
              points.hadesWindwallCenter,
              points.r2TopLeft,
              points.r1TopRight,
              points.r1TopMiddle
            ],
          ]
        ],
        'properties': {
          'popupContent': 'This is a free bus line that will take you across downtown.',
          'underConstruction': true
        },
        'label': 'H2',
        'id': 10
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.l1TopRight,
              points.h3TopMiddle,
              points.h3TopRight,
              points.h4TopRight,
              points.hadesWindwallCenter,
              points.h1TopRight
            ],
          ]
        ],
        'properties': {
          'popupContent': 'This is a free bus line that will take you across downtown.',
          'underConstruction': true
        },
        'label': 'H3',
        'id': 6
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.hadesWindwallCenter,
              points.h4TopRight,
              points.h5TopLeft,
              points.r2TopRight,
              points.r2TopLeft
            ],
          ]
        ],
        'properties': {
          'popupContent': 'This is a free bus line that will take you across downtown.',
          'underConstruction': true
        },
        'label': 'H4',
        'id': 11
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              points.h5TopLeft,
              points.h5TopMiddle,
              points.h5TopRight,
              points.r3TopRight,
              points.r3TopLeft,
              points.r2TopRight
            ],
          ]
        ],
        'properties': {
          'popupContent': 'This is a free bus line that will take you across downtown.',
          'underConstruction': true
        },
        'label': 'H5',
        'id': 12
      }
    }]
  },
  havenWall: {
    'type': 'Feature',
    'geometry': {
      'type': 'LineString',
      'coordinates': [
        [895, 1000],
        [895, 0]
      ]
    },
  },
  windWalls: {
    'type': 'FeatureCollection',
    'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            points.a1TopRight,
            points.l1TopMiddle
          ]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            points.a2TopRight,
            points.h3TopMiddle
          ]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            points.a3TopRight,
            points.a5TopRight
          ]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            points.h3TopRight,
            points.a5TopRight
          ]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            points.h1TopRight,
            points.r1TopMiddle
          ]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            points.h1TopRight,
            points.hadesWindwallCenter
          ]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            points.hadesWindwallCenter,
            points.h4TopRight
          ]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            points.hadesWindwallCenter,
            points.r2TopLeft
          ]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            points.h5TopLeft,
            points.r2TopRight
          ]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            points.r1TopRight,
            points.k2TopRight
          ]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            points.r3TopLeft,
            points.k3TopRight
          ]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            points.k2TopLeft,
            points.k2TopMiddle
          ]
        }
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            points.k2TopRight,
            points.k2BottomRight
          ]
        }
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            points.k3TopRight,
            points.k3BottomRight,
          ]
        }
      },
    ]
  },
  stormWalls: {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          points.l1TopLeft,
          points.l1TopMiddle
        ]
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          points.l1TopMiddle,
          points.l1TopRight,
        ]
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          points.a5TopRight,
          points.o1TopRight,
        ]
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          points.a5TopRight,
          points.h5TopMiddle,
        ]
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          points.k1TopRight,
          points.k2TopMiddle,
        ]
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          points.k2TopMiddle,
          points.k2TopRight
        ]
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          points.k2TopRight,
          points.k3TopRight,
        ]
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          points.k3TopRight,
          points.k4TopRight,
        ]
      }
    }]
  },
  sandWalls: {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          points.h1TopLeft,
          points.h1TopRight,
          points.h1TopRight,
          points.l1TopRight,
          points.h3TopMiddle,
          points.h3TopRight,
          points.h4TopRight,
          points.h5TopLeft,
          points.h5TopMiddle,
          points.h5TopRight
        ]
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          points.k1TopLeft,
          points.k1TopRight,
          points.r1TopMiddle,
          points.r1TopRight,
          points.r2TopLeft,
          points.r2TopRight,
          points.r3TopLeft,
          points.r3TopRight
        ]
      }
    }]
  },
  borderWalls: {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          points.topLeft,
          points.topRight,
          points.bottomRight,
          points.bottomLeft,
          points.topLeft
        ]
      }
    }]
  }
};
