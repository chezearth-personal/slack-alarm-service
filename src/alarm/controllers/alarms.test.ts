'use strict';

import * as chai from 'chai';

import { AlarmDb } from '../../common/types/docs';
import { getNewAlarms, removeAll } from '../../../dist/alarm/controllers/alarms';
import { getMany } from '../../../dist/common/db/crud';


const expect = chai.expect;

let check: boolean = false;

describe(`'controllers/alarms.ts' tests. Collecting alarms from database`, function() {


  after(async function() {

    try {

      if(
        process.env.CLEAN_TEST
          && ['true', 'yes', 'y', 't']
            .includes(process.env.CLEAN_TEST.toLowerCase())
      ) await removeAll('alarms');
      return Promise.resolve();

    } catch(e) {

      return Promise.reject(e);

    }

  });




  describe('#GET all alarms', async function() {

    try {

      const selected: number[] = [ 0, 3, 5 ]
      const storedAlarms: AlarmDb[] = await getMany('alarms', {}, {}, {});
      const timeSlots = storedAlarms.filter((alarm, i) => selected.includes(i)).map(alarm => alarm.alertAt);

      timeSlots.forEach((timeSlot, i) => {


        describe(`alarms at this time: ${timeSlot}`, function () {

          it('should get all alarm(s)', async function() {

            try {

              const alarms: AlarmDb[] = await getNewAlarms(timeSlot);
              if(i === 1) expect(alarms.length).to.equal(2);
              if(i !== 1) expect(alarms.length).to.equal(1);

              return Promise.resolve();

            } catch(e) {

              return Promise.reject(e);

            }


        });

        });

      });

      return Promise.resolve();

    } catch(e) {

      return Promise.reject(e);

    }


  });


});
