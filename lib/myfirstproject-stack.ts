import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { AclCidr, AclTraffic, Connections, NetworkAcl, NetworkAclEntry, Peer, PublicSubnet, TrafficDirection } from '@aws-cdk/aws-ec2';


export class MyfirstprojectStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "Vpc", {
      //cidr: '10.0.0.0/16',
      maxAzs: 1,
      
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Ingress',
          subnetType: ec2.SubnetType.PUBLIC,
        }
      ]
    });

    /*
    const publicSubnet = new PublicSubnet(this, 'PublicSubnet', {
      availabilityZone: 'us-west-2a',
      cidrBlock: '10.0.0.0/24',
      vpcId: 'Vpc8378EB38',
    });
    */

    const acl = new NetworkAcl(this, "Acl", {vpc: vpc, subnetSelection: { subnetGroupName: 'Ingress'}});

    acl.addEntry('SSHEgress', {
      cidr: AclCidr.anyIpv4(),
      ruleNumber: 1,
      traffic: AclTraffic.tcpPort(22), 
      direction: TrafficDirection.EGRESS,
    })
    acl.addEntry('SSHIngress', {
      cidr: AclCidr.anyIpv4(),
      ruleNumber: 1,
      traffic: AclTraffic.tcpPort(22), 
      direction: TrafficDirection.INGRESS,
    })
    acl.addEntry('HTTPEgress', {
      cidr: AclCidr.anyIpv4(),
      ruleNumber: 2,
      traffic: AclTraffic.tcpPort(80), 
      direction: TrafficDirection.EGRESS,
    })
    acl.addEntry('HTTPIngress', {
      cidr: AclCidr.anyIpv4(),
      ruleNumber: 2,
      traffic: AclTraffic.tcpPort(80), 
      direction: TrafficDirection.INGRESS,
    })
    acl.addEntry('HTTPSEgress', {
      cidr: AclCidr.anyIpv4(),
      ruleNumber: 3,
      traffic: AclTraffic.tcpPort(443), 
      direction: TrafficDirection.EGRESS
    })
    acl.addEntry('HTTPSIngress', {
      cidr: AclCidr.anyIpv4(),
      ruleNumber: 3,
      traffic: AclTraffic.tcpPort(443), 
      direction: TrafficDirection.INGRESS
    })
    acl.addEntry('EphemeralEgress', {
      cidr: AclCidr.anyIpv4(),
      ruleNumber: 4,
      traffic: AclTraffic.tcpPortRange(1024, 65535), 
      direction: TrafficDirection.EGRESS 
    })
    acl.addEntry('EphemeralIngress', {
      cidr: AclCidr.anyIpv4(),
      ruleNumber: 4,
      traffic: AclTraffic.tcpPortRange(1024, 65535), 
      direction: TrafficDirection.INGRESS
    })
    acl.addEntry('SMTPEngress', {
      cidr: AclCidr.anyIpv4(),
      ruleNumber: 5,
      traffic: AclTraffic.tcpPort(465), 
      direction: TrafficDirection.EGRESS 
    })


    const securityGroup = new ec2.SecurityGroup(this, "sg", {vpc: vpc,allowAllOutbound: true,});

    securityGroup.addIngressRule(Peer.anyIpv4(), ec2.Port.tcp(80), 'HTTP from anywhere');
    securityGroup.addIngressRule(Peer.anyIpv4(), ec2.Port.tcp(443), 'HTTPS from anywhere');
    securityGroup.addIngressRule(Peer.anyIpv4(), ec2.Port.tcp(8080), 'Jenkins from anywhere');
    securityGroup.addIngressRule(Peer.anyIpv4(), ec2.Port.tcp(22), 'SSH from anywhere');
  }
}
